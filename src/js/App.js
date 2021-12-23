import * as THREE from "three";
import { MeshPhongMaterial } from "three";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/shaderpass";

import { PointLight } from "three";

import gsap from "gsap";
import { Power2 } from "gsap/all";

import Pyramid from "./Pyramid";
import Palette from "./Palette";

class App
{
	constructor()
	{
		const container			= document.body;
		const fov				= 45;

		this.container			= container;

		this.renderer			= new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.container.prepend(this.renderer.domElement);
		
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.y = 9 / 8;
		this.camera.position.z = 16 / 8;
		this.camera.lookAt(new THREE.Vector3(0,0,0));
		
		this.initScene();
		this.initAnimation();
		this.initPostProcessing();
		
		requestAnimationFrame(() => {
			this.onAnimationFrame();
		});

		window.addEventListener("resize", event => this.onWindowResize(event));
	}
	
	initScene()
	{
		this.scene		= new THREE.Scene();
		
		this.plane		= {
			material:	this.createPlaneMaterial( Palette.getRandomColor() )
		};

		this.plane.mesh	= new THREE.Mesh(
			new THREE.PlaneGeometry(1000, 1000, 1, 1),
			this.plane.material
		);

		this.pyramid	= new Pyramid();
		this.light		= new PointLight(0xffffff, 1.0, 16, 0.5);

		this.plane.mesh.position.y = this.pyramid.position.y;
		this.plane.mesh.lookAt(new THREE.Vector3(0, 1, 0));

		this.light.position.copy(this.camera.position);

		this.scene.add(this.light);
		this.scene.add(this.plane.mesh);
		this.scene.add(this.pyramid);
	}

	initAnimation()
	{
		const timeline = gsap.timeline({repeat: -1});

		timeline.to(this.pyramid, {
			scaleScalar: 1,
			duration: 10
		});

		timeline.to(this.pyramid, {
			openness: 1,
			duration: 10
		});

		timeline.to(this.pyramid, {
			scaleScalar: 100,
			ease: Power2.easeIn,
			duration: 10
		});

		timeline.call(() => {
			this.setPlaneColor(this.pyramid.color);
			this.pyramid.setRandomColor();
		});
	}

	initPostProcessing()
	{
		this.composer = new EffectComposer( this.renderer );

		this.passes				= {
			render:			new RenderPass( this.scene, this.camera ),
			// afterImage:		new AfterimagePass(0.96),
			glitch:			new GlitchPass(),
			pixel:			new ShaderPass( PixelShader ),
		};

		this.passes.pixel.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
		this.passes.pixel.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio );
		this.passes.pixel.uniforms[ "pixelSize" ].value = window.innerWidth / 240;

		for(let key in this.passes)
			this.composer.addPass(this.passes[key]);
	}

	createPlaneMaterial(color)
	{
		return new MeshPhongMaterial({
			color: color,
			depthWrite: false
		});
	}
	
	setPlaneColor(color)
	{
		this.plane.mesh.material =
			this.plane.material = 
			this.createPlaneMaterial(color);
	}

	onAnimationFrame()
	{
		this.pyramid.rotation.y += 0.01;

		this.composer.render();
		
		requestAnimationFrame(() => {
			this.onAnimationFrame();
		});
	}

	onWindowResize(event)
	{
		this.camera.aspect = window.innerWidth / window.innerHeight;
  		this.camera.updateProjectionMatrix();
  		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

export default App;