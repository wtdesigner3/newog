/**
 * Unified Database Access Bridge
 * Re-exports connection managers, safe connect wrappers, and diagnostic helpers.
 */
import connectDB, {
  connectDBSafe,
  isDBConnected,
  getDBStatus,
  getMaskedURI,
  resetDBCooldown,
} from "../app/lib/config.js";

export {
  connectDB,
  connectDBSafe,
  isDBConnected,
  getDBStatus,
  getMaskedURI,
  resetDBCooldown,
};
export default connectDB;
