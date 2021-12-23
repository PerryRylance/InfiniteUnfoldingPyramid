import { Power2 } from "gsap/all";
import * as THREE from "three";
import { Vector3 } from "three";
import { Euler } from "three";
import { MeshPhongMaterial } from "three";
import { Mesh } from "three";
import { CircleBufferGeometry, Object3D } from "three"

import Palette from "./Palette";

export default class Pyramid extends Object3D
{
	constructor()
	{
		super();

		// TDOO: Use 8 bit palette
		this.setRandomColor();

		this.base	= new Mesh(
			new CircleBufferGeometry(Pyramid.RADIUS, 1),
			this.material
		);

		this.base.lookAt(new Vector3(0, 1, 0));

		// Sides
		const a = Math.sqrt(6) / 3;
		const b = Math.sqrt(1 / 12);
		const c = Math.sqrt(3) / 2;

		this._closedRotationZ		= -(Math.PI / 2) + Math.acos( (b*b + c*c - a*a) / (2 * b * c) );
		this._openRotationZ			= Math.PI / 2;

		this.add(this.base);

		this.sides	= [];

		for(let i = 0; i < 3; i++)
		{
			let side = this.createSide(i);

			this.add(side);
			this.sides.push(side);
		}

		const length	= 2 * Pyramid.RADIUS * Math.cos(30 / 180 * Math.PI);
		this.position.y = -(length * Math.sqrt(3)) / 6;

		// NB: Animation stuff
		this._scale		= 0;
		this._openness	= 0;

		this.scaleScalar = 0;
	}
	
	get color()
	{
		return this._color;
	}

	createMaterial()
	{
		return new MeshPhongMaterial({
			color: this._color,
			side: THREE.DoubleSide
		})
	}

	setRandomColor()
	{
		this._color = Palette.getRandomColor();

		this.material = this.createMaterial();

		if(this.base)
			this.base.material = this.material;
		
		if(this.sides)
			for(let i = 0; i < this.sides.length; i++)
				this.sides[i].mesh.material = this.material;
	}

	get scaleScalar()
	{
		return this._scaleScalar;
	}

	set scaleScalar(value)
	{
		this._scaleScalar = value;
		this.scale.setScalar(value);
	}

	get openness()
	{
		return this._openness;
	}

	set openness(value)
	{
		this._openness = Math.min(value, 1.0);

		for(let i = 0; i < this.sides.length; i++)
			this.setSideOpenness(i, value * 3 - i);
	}

	setSideOpenness(index, openness)
	{
		openness = Math.min( openness, 1.0 );
		openness = Math.max( openness, 0.0 );

		// TODO: Ease openness

		openness = Power2.easeInOut(openness);

		const a = this._closedRotationZ;
		const b = this._openRotationZ;
		const r = a * (1 - openness) + b * openness;

		this.sides[index].rotation.z = r;
	}

	createSide(index)
	{
		const pivot		= new Object3D();
		const side		= new Object3D();
		const container = new Object3D();

		const geom		= new CircleBufferGeometry(Pyramid.RADIUS, 1);
		const mesh		= new Mesh(geom, this.material);
		const length	= 2 * Pyramid.RADIUS * Math.cos(30 / 180 * Math.PI);

		mesh.position.x	= (length * Math.sqrt(3)) / 6;

		pivot.rotation.z = 2 * Math.PI / 4;
		pivot.rotation.y = 2 * Math.PI / 4;

		pivot.add(mesh);
		side.add(pivot);
		container.add(side);

		switch(index)
		{
			case 0:

				container.position.x = -mesh.position.x;

				break;
			
			case 1:

				container.rotation.y = 120 / 180 * Math.PI;

				container.position.x = Math.sin(30 / 180 * Math.PI) * mesh.position.x;
				container.position.z = Math.cos(30 / 180 * Math.PI) * mesh.position.x;

				break;
			
			case 2:

				container.rotation.y = -120 / 180 * Math.PI;

				container.position.x = Math.sin(30 / 180 * Math.PI) * mesh.position.x;
				container.position.z = -Math.cos(30 / 180 * Math.PI) * mesh.position.x;

				break;
			
			default:
				throw new Error("Oops...");
				break;
		}

		container.rotation.z = this._closedRotationZ;

		container.mesh = mesh;

		return container;
	}
}

Pyramid.RADIUS		= 1;