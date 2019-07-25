import HttpClient from '../http';
import axios from 'axios';

describe('HttpClient', () => {
  describe('getContentType', () => {
    it('should return javascript', () => {
      const contentType = HttpClient.getContentType('foo.js');
      expect(contentType).toEqual('application/javascript');
    });

    it('should return javascript even if route is multiple dots', () => {
      const contentType = HttpClient.getContentType('foo.bar.js');
      expect(contentType).toEqual('application/javascript');
    });

    it('should return json for map files', () => {
      const contentType = HttpClient.getContentType('foo.map');
      expect(contentType).toEqual('application/json');
    });

    it('should return json for map files for multi dots', () => {
      const contentType = HttpClient.getContentType('foo.js.map');
      expect(contentType).toEqual('application/json');
    });

    it('should return octet for unknown extensions', () => {
      const contentType = HttpClient.getContentType('foo.bar');
      expect(contentType).toEqual('application/octet-stream');
    });
  });
});
