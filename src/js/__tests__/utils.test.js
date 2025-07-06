import { calcTileType } from "../utils.js";

describe('calcTileType', () => {
  
  describe('Corner Elements', () => {
    test('should return "top-left" for the top-left corner cell', () => {
      expect(calcTileType(0, 5)).toBe('top-left');
    });

    test('should return "top-right" for the top-right corner cell', () => {
      expect(calcTileType(4, 5)).toBe('top-right');
    });

    test('should return "bottom-left" for the bottom-left corner cell', () => {
      expect(calcTileType(20, 5)).toBe('bottom-left');
    });

    test('should return "bottom-right" for the bottom-right corner cell', () => {
      expect(calcTileType(24, 5)).toBe('bottom-right');
    });
  });

  describe('Edge Elements', () => {
    test('should return "top" for the top edge non-corner cell', () => {
      expect(calcTileType(1, 5)).toBe('top');
    });

    test('should return "left" for the left edge non-corner cell', () => {
      expect(calcTileType(5, 5)).toBe('left');
    });

    test('should return "right" for the right edge non-corner cell', () => {
      expect(calcTileType(9, 5)).toBe('right');
    });

    test('should return "bottom" for the bottom edge non-corner cell', () => {
      expect(calcTileType(22, 5)).toBe('bottom');
    });
  });

  describe('Center Element', () => {
    test('should return "center" for the center cell', () => {
      expect(calcTileType(7, 5)).toBe('center');
    });
  });

});
