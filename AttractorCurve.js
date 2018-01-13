// Created by Mikael Hvidtfeldt Christensen, (Twitter: @SyntopiaDK, web: hvidtfeldts.net).

/*
MIT License

Copyright (c) 2018 Mikael Hvidtfeldt Christensen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var assert = function(condition) { 
    if (!condition) {
        debugger;
        throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
    }
};

function AttractorCurve(count, attractor, radius, timeStep, facets) {
    THREE.Curve.call(this);
    this.type = 'AttractorCurve';
    this.autoClose = false; // Automatically closes the path
    this.pos = [];
    this.normals = [];
    this.tangents = [];
    this.count = count ;
    this.attractor = attractor;
    this.radius = radius;
    this.timeStep = timeStep;
    this.facets = facets;
}

AttractorCurve.prototype = Object.assign(AttractorCurve.prototype, {

    constructor: AttractorCurve,

    build: function () {
        var start = performance.now();

        this.pos = new Array(this.count);
        this.tangents = new Array(this.count);

        var p = [0, 1, 1];
        var t = this.timeStep;
        var subAdvance = 2;

        // Warmup
        for (var i = 0; i < 1000; i++) {
            p = this.attractor.advance(p, t / subAdvance);
        }

        // This calculates points and normals along the curve.
        // This can be done simply be moving in the direction of the derivative.
        //
        // The normal is calculated by taking a point given by the sum of the previous point and normal, and 
        // advancing this using the attractor equation. This gives us a new normal point, which is made orthogonal to the tangent.
        // This creates a smooth orthogonal frame (I did try Frenet frames (normals based on acceleration), but that will not work for near-linear stretches)
        for (var i = 0; i < this.count; i++) {
            var old = [p[0], p[1], p[2]];

            // A bit higher resolution by taking smaller steps
            for (var j = 0; j < subAdvance; j++)
                p = this.attractor.advance(p, t / subAdvance);

            var position = new THREE.Vector3(p[0], p[1], p[2]);
            var tangent = new THREE.Vector3(p[0] - old[0], p[1] - old[1], p[2] - old[2]);
            tangent = tangent.normalize();

            if (i == 0) {
                // First step: create a random normal.
                var normal = new THREE.Vector3(1, 0, 0);
                normal = normal.projectOnPlane(tangent);
                normal = normal.normalize();
                this.normals.push(normal);
            } else {
                // Move previous normal along the path (using the Attractor equations), and orthogonalize it.
                var normal = [this.pos[i - 1].x + this.normals[i - 1].x, this.pos[i - 1].y + this.normals[i - 1].y,
                this.pos[i - 1].z + this.normals[i - 1].z];
                normal = this.attractor.advance(normal, t);
                normal = new THREE.Vector3(normal[0] - p[0], normal[1] - p[1], normal[2] - p[2]);
                normal = normal.projectOnPlane(tangent);
                normal = normal.normalize();
                this.normals.push(normal);
            }
            this.pos[i] = position;
            this.tangents[i] = tangent;
        }

        this.center();

        var end = performance.now();
        console.log('Building attractor took ' + (end - start) + ' ms. ' + this.pos.length + " steps.");
    },

    get2DShape: function () {
        var size = this.radius;
        var points = [];
        var normals = [];
        for (var i = 0; i < this.facets + 1; i++) {
            var a = i / (this.facets / 2) * Math.PI;
            points.push([Math.cos(a) * size, Math.sin(a) * size]);
            normals.push([Math.cos(a) * size, Math.sin(a) * size]);
        }

        return {
            points: points,
            normals: normals
        };
    },


    getGeometry: function () {
        var start = performance.now();

        var shape = this.get2DShape();
        var shapeCount = shape.points.length;

        var geometry = new THREE.BufferGeometry();
        var vertexCount = this.count * (shapeCount - 1) * 3 + 2 * 3; // +2*3 for caps
        var positions = new Array(vertexCount); 
        var normals = new Array(vertexCount);
        var colors = [];
        var indicesCount = (this.count - 1 + 6) * (shapeCount - 1) * 6 ;
        var indices = new Array(indicesCount);

        var frames = this.getFrames();

        function addVertex(p1, p2, p3, n1, n2, n3) {
            positions.push(p1[0], p1[1], p1[2]);
            positions.push(p2[0], p2[1], p2[2]);
            positions.push(p3[0], p3[1], p3[2]);
            normals.push(n1[0], n1[1], n1[2]);
            normals.push(n2[0], n2[1], n2[2]);
            normals.push(n3[0], n3[1], n3[2]);
        };

        var p = 0;
        var n = 0;
        function inFrame(coord, ncoord, normal, binormal, pos) {
            // pos.clone().addScaledVector(normal, coord[0]).addScaledVector(binormal, coord[1]);
            positions[p++] = pos.x + coord[0] * normal.x + coord[1] * binormal.x;
            positions[p++] = pos.y + coord[0] * normal.y + coord[1] * binormal.y;
            positions[p++] = pos.z + coord[0] * normal.z + coord[1] * binormal.z;
            // (new THREE.Vector3()).addScaledVector(normal, coord[0]).addScaledVector(binormal, coord[1]);
            normals[n++] = ncoord[0] * normal.x + ncoord[1] * binormal.x;
            normals[n++] = ncoord[0] * normal.y + ncoord[1] * binormal.y;
            normals[n++] = ncoord[0] * normal.z + ncoord[1] * binormal.z;
        };

        for (var i = 0; i < this.count; i++) {
            for (var j = 0; j < shapeCount - 1; j++) {
                // Create a quad (two triangles) along extrusion path
                var s1 = shape.points[j];
                var sn1 = shape.normals[j];
                inFrame(s1, sn1, frames.normals[i], frames.binormals[i], this.pos[i]);
            }
        }

        var ind = 0;
        for (var i = 0; i < this.count - 1; i++) {
            for (var j = 0; j < shapeCount - 1; j++) {
                var p1 = i * (shapeCount - 1) + j;
                var p2 = (j == shapeCount - 2) ? p1 - (shapeCount - 2) : p1 + 1;
                var p1next = p1 + (shapeCount - 1);
                var p2next = (j == shapeCount - 2) ? p1next - (shapeCount - 2) : p1next + 1;
                indices[ind++] = p1;
                indices[ind++] = p2;
                indices[ind++] = p1next;

                indices[ind++] = p1next;
                indices[ind++] = p2;
                indices[ind++] = p2next;
            }
        }

        // Create endcaps
        var firstPos = this.pos[0];
        var lastPos = this.pos[this.pos.length - 1];
        positions[p++] = firstPos.x;
        positions[p++] = firstPos.y;
        positions[p++] = firstPos.z;
        normals[n++] = -frames.tangents[0].x;
        normals[n++] = -frames.tangents[0].y;
        normals[n++] = -frames.tangents[0].z;
        positions[p++] = lastPos.x;
        positions[p++] = lastPos.y;
        positions[p++] = lastPos.z;
        normals[n++] = frames.tangents[this.pos.length - 1].x;
        normals[n++] = frames.tangents[this.pos.length - 1].y;
        normals[n++] = frames.tangents[this.pos.length - 1].z;
        for (var j = 0; j < shapeCount - 1; j++) {
            var p1 = j;
            var p2 = (j == shapeCount - 2) ? 0 : j + 1;
            var p3 = positions.length / 3 - 2;
            indices[ind++] = p2;
            indices[ind++] = p1;
            indices[ind++] = p3;

            p1 = j + positions.length / 3 - (shapeCount - 1) - 2;
            p2 = (j == shapeCount - 2) ? positions.length / 3 - (shapeCount - 1) - 2 : p1 + 1;
            p3 = positions.length / 3 - 1;
            indices[ind++] = p1;
            indices[ind++] = p2;
            indices[ind++] = p3;
        }
        assert(indicesCount == indices.length);
        assert(vertexCount == positions.length);
        
        function disposeArray() { this.array = null; }
        geometry.setIndex(indices);
        geometry.setDrawRange(0, indices.length);

        // We cannot dispose of arrays, if we want the STL and OBJ exporters to work :-(
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); //.onUpload(disposeArray));
        geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3)); //.onUpload(disposeArray));

        var end = performance.now();
        console.log('Building geometry took ' + (end - start) + ' ms. (' + ind / 3 + " triangles, " + positions.length / 3 + " vertices.");
        return geometry;
    },

    getFrames: function () {
        var binormals = [];
        for (var i = 0; i < this.pos.length; i++) {
            var p = new THREE.Vector3();
            p.crossVectors(this.tangents[i], this.normals[i]);
            p = p.normalize();
            binormals.push(p);
        };

        return {
            tangents: this.tangents,
            normals: this.normals,
            binormals: binormals
        }
    },

    center: function () {
        // Find center
        var p = new THREE.Vector3();
        for (var i = 0; i < this.pos.length; i++) {
            p.add(this.pos[i]);
        }
        p.multiplyScalar(-1.0 / this.pos.length);


        for (var i = 0; i < this.pos.length; i++) {
            this.pos[i].add(p);
        }

        var bb = new THREE.Box3();
        bb.setFromPoints(this.pos);
        var maxDim = Math.max(bb.getSize().x, bb.getSize().y, bb.getSize().z);
        var minY = bb.min.y;


        // Add attractor specific offset and scaling
        var offset = new THREE.Vector3(0, -minY, 0); // this.attractor.getOffset();
        var scale = 30.0 / maxDim; // this.attractor.getScale();
        for (var i = 0; i < this.pos.length; i++) {
            //  this.pos[i].add(p);
            this.pos[i].add(offset);
            this.pos[i].multiplyScalar(scale);
        }
    },

    init: function () {
        this.build();
    },


});

