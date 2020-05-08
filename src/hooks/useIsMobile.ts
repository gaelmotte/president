import { UAParser } from "ua-parser-js";

import * as _ from "lodash";

const useIsMobile = _.memoize(() => {
  var parser = new UAParser();
  var result = parser.getResult();
  return result.device.type === "mobile";
});

export default useIsMobile;
