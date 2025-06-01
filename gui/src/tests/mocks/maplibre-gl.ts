module.exports = {
  Map: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    off: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    getSource: jest.fn(),
    getLayer: jest.fn(),
    removeLayer: jest.fn(),
    removeSource: jest.fn(),
    dragPan: { enable: jest.fn(), disable: jest.fn() },
    scrollZoom: { enable: jest.fn(), disable: jest.fn() },
    remove: jest.fn(),
  })),
};
