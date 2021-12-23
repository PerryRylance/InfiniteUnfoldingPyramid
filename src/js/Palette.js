export default class Palette
{
	static getRandomColor()
	{
		const palette = [
			0x555555,
			0x000000,
			0x5555FF,
			0x0000AA,
			0x55FF55,
			0x00AA00,
			0x55FFFF,
			0x00AAAA,
			0xFF5555,
			0xAA0000,
			0xFF55FF,
			0xAA00AA,
			0xFFFF55,
			0xAA5500,
			0xFFFFFF,
			0xAAAAAA
		];

		return palette[ Math.floor(Math.random() * palette.length) ];
	}
}