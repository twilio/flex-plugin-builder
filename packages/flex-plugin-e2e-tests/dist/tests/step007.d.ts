import { TestSuite } from '../core';
export declare const originalCode = "const [isOpen, setIsOpen] = useState(true);";
export declare const codeWithViolation = "const config = {\n    colorTheme: {\n      baseLight: \"white\",\n    },\n    sdkOptions: {\n      voice: {\n        iceServers: [],\n      },\n    },\n  };\n  const [isOpen, setIsOpen] = useState(true);";
export declare const WARNING_REGEX: RegExp;
declare const testSuite: TestSuite;
export default testSuite;
