// Created by Mikael Hvidtfeldt Christensen, (Twitter: @SyntopiaDK, web: hvidtfeldts.net).
// Released under Creative Commons Attribution License 3.0: https://creativecommons.org/licenses/by/3.0/

function AttractorCurve(count, attractor) {
    THREE.Curve.call(this);
    this.type = 'AttractorCurve';
    this.autoClose = false; // Automatically closes the path
    this.pos = [];
    this.normals = [];
    this.tangents = [];
    this.count = count+1;
    this.attractor = attractor;
}

AttractorCurve.prototype = Object.assign(AttractorCurve.prototype, {

    constructor: AttractorCurve,

    build: function () {
        var start = performance.now();
        
        var p = [0, 1, 1];
        var t = 0.01 * 2;
        var subAdvance = 20;

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
            // A bit higher resolution by taking smaller steps
            for (var j = 0; j < subAdvance; j++)
                p = this.attractor.advance(p, t / subAdvance);

            var pb = this.attractor.advance(p, -t);
            var pa = this.attractor.advance(p, t);

            var position = new THREE.Vector3(p[0], p[1], p[2]);
            var tangent = new THREE.Vector3(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);

            tangent = tangent.normalize();

            if (i == 0) {
                // First step: create a random normal.
                var normal = new THREE.Vector3(1, 0, 0);
                normal = normal.projectOnPlane(tangent);
                normal = normal.normalize();
                this.normals.push(normal);
            } else {
                // Move previous normal along the path (using the Attractor equations), and orthogonalize it.
                var normal= [this.pos[i - 1].x + this.normals[i - 1].x, this.pos[i - 1].y + this.normals[i - 1].y,
                this.pos[i - 1].z + this.normals[i - 1].z];
                normal = this.attractor.advance(normal, t);
                normal = new THREE.Vector3(normal[0] - p[0], normal[1] - p[1], normal[2] - p[2]);
                normal = normal.projectOnPlane(tangent);
                normal = normal.normalize();
                this.normals.push(normal);
            }
            this.pos.push(position);
            this.tangents.push(tangent);
        }

        this.center();

        var end = performance.now();
        console.log('Building attractor took ' + (end - start) + ' ms.');
    },

    get2DShape: function() {
        var size = 0.3;
        var points = [], numPts = 5;
        var normals = [];
        for ( var i = 0; i < numPts * 2+1; i ++ ) {
                var l = i % 2 == 1 ? 1*size : 1.6*size;
                var a = i / numPts * Math.PI;
                points.push( [ Math.cos( a ) * l, Math.sin( a ) * l ] );
                normals.push( [ Math.cos( a ) * l, Math.sin( a ) * l ] );
            }
        
            return { points: points,
                     normals: normals };
    },

    
    getGeometry: function() {
        var start = performance.now();

        var geometry = new THREE.BufferGeometry();
        var positions = [];
        var normals = [];
        var colors = [];
        var indices = [];
        
        var shape = this.get2DShape();
        var shapeCount = shape.points.length;
        
        var frames = this.getFrames();

        function addVertex(p1,p2,p3,n1,n2,n3) {
            positions.push(p1[0],p1[1],p1[2]);
            positions.push(p2[0],p2[1],p2[2]);
            positions.push(p3[0],p3[1],p3[2]);
            normals.push(n1[0],n1[1],n1[2]);
            normals.push(n2[0],n2[1],n2[2]);
            normals.push(n3[0],n3[1],n3[2]);
        };

        function inFrame(coord, normal, binormal, pos) {
            if ( pos !== undefined ) {
                var t = pos.clone().addScaledVector(normal, coord[0]).addScaledVector(binormal, coord[1]);
                return [t.x,t.y,t.z];
            } else {
                var t = (new THREE.Vector3()).addScaledVector(normal, coord[0]).addScaledVector(binormal, coord[1]);
                return [t.x,t.y,t.z];
            }
        };
    
        var tris = 0;
        for (var i = 0; i < this.count; i++) {
            
            for (var j = 0; j<shapeCount-1; j++) {
                // Create a quad (two triangles) along extrusion path
                var s1 = shape.points[j];
                var s2 = shape.points[j+1];
                var sn1 = shape.normals[j];
                var sn2 = shape.normals[j+1];
               
                var p1 = inFrame(s1, frames.normals[i], frames.binormals[i], this.pos[i]);
             //   var p1next = inFrame(s1, frames.normals[i+1], frames.binormals[i+1], this.pos[i+1]);
             //   var p2 = inFrame(s2, frames.normals[i], frames.binormals[i], this.pos[i]);
             //   var p2next = inFrame(s2, frames.normals[i+1], frames.binormals[i+1], this.pos[i+1]);
                var n1 = inFrame(sn1, frames.normals[i], frames.binormals[i]);
            //    var n1next = inFrame(sn1, frames.normals[i+1], frames.binormals[i+1]);
             //   var n2 = inFrame(sn2, frames.normals[i], frames.binormals[i]);
             //   var n2next = inFrame(sn2, frames.normals[i+1], frames.binormals[i+1]);
               positions.push(p1[0],p1[1],p1[2]);
                 normals.push(n1[0],n1[1],n1[2]);
              


                //addVertex(p1,p2,p1next,n1,n2,n1next);
                //addVertex(p1next,p2,p2next,n1next,n2,n2next);
                //tris += 2;
            }         
        }

        for (var i = 0; i < this.count-2; i++) {
            for (var j = 0; j<shapeCount-1; j++) {
                var p1 = i*(shapeCount-1)  + j;
                var p2 = i*(shapeCount-1)  + j + 1;
                var p1next = (i+1)*(shapeCount-1)  + j;
                var p2next = (i+1)*(shapeCount-1)  + j + 1;
                indices.push(p1,p2,p1next);
                indices.push(p1next,p2,p2next);
            }         
        }

        function disposeArray() { this.array = null; }
        geometry.setIndex(indices);
        geometry.setDrawRange(0,indices.length);
        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
        geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
        //geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ).onUpload( disposeArray ) );
        geometry.computeBoundingSphere();

        var end = performance.now();
        console.log('Building geometry took ' + (end - start) + ' ms. (' + tris + " triangles added).");
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
        var maxDim = Math.max(bb.getSize().x,bb.getSize().y,bb.getSize().z);
        var minY = bb.min.y;


        // Add attractor specific offset and scaling
        var offset = new THREE.Vector3(0,-minY,0); // this.attractor.getOffset();
        var scale = 30.0/maxDim; // this.attractor.getScale();
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

