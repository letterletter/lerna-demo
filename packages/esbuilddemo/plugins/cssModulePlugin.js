"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name41 in all)
    __defProp(target, name41, { get: all[name41], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/universalify@2.0.0/node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/.pnpm/universalify@2.0.0/node_modules/universalify/index.js"(exports) {
    "use strict";
    exports.fromCallback = function(fn) {
      return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === "function")
          fn.apply(this, args);
        else {
          return new Promise((resolve, reject) => {
            fn.call(this, ...args, (err, res) => err != null ? reject(err) : resolve(res));
          });
        }
      }, "name", { value: fn.name });
    };
    exports.fromPromise = function(fn) {
      return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== "function")
          return fn.apply(this, args);
        else
          fn.apply(this, args.slice(0, -1)).then((r) => cb(null, r), cb);
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/.pnpm/graceful-fs@4.2.10/node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.10/node_modules/graceful-fs/polyfills.js"(exports, module2) {
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch2;
    function patch2(fs2) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs2);
      }
      if (!fs2.lutimes) {
        patchLutimes(fs2);
      }
      fs2.chown = chownFix(fs2.chown);
      fs2.fchown = chownFix(fs2.fchown);
      fs2.lchown = chownFix(fs2.lchown);
      fs2.chmod = chmodFix(fs2.chmod);
      fs2.fchmod = chmodFix(fs2.fchmod);
      fs2.lchmod = chmodFix(fs2.lchmod);
      fs2.chownSync = chownFixSync(fs2.chownSync);
      fs2.fchownSync = chownFixSync(fs2.fchownSync);
      fs2.lchownSync = chownFixSync(fs2.lchownSync);
      fs2.chmodSync = chmodFixSync(fs2.chmodSync);
      fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
      fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
      fs2.stat = statFix(fs2.stat);
      fs2.fstat = statFix(fs2.fstat);
      fs2.lstat = statFix(fs2.lstat);
      fs2.statSync = statFixSync(fs2.statSync);
      fs2.fstatSync = statFixSync(fs2.fstatSync);
      fs2.lstatSync = statFixSync(fs2.lstatSync);
      if (fs2.chmod && !fs2.lchmod) {
        fs2.lchmod = function(path2, mode, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs2.lchmodSync = function() {
        };
      }
      if (fs2.chown && !fs2.lchown) {
        fs2.lchown = function(path2, uid, gid, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs2.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs2.rename = typeof fs2.rename !== "function" ? fs2.rename : function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs2.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb)
                cb(er);
            });
          }
          if (Object.setPrototypeOf)
            Object.setPrototypeOf(rename, fs$rename);
          return rename;
        }(fs2.rename);
      }
      fs2.read = typeof fs2.read !== "function" ? fs2.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(read, fs$read);
        return read;
      }(fs2.read);
      fs2.readSync = typeof fs2.readSync !== "function" ? fs2.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs2, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      }(fs2.readSync);
      function patchLchmod(fs3) {
        fs3.lchmod = function(path2, mode, callback) {
          fs3.open(path2, constants.O_WRONLY | constants.O_SYMLINK, mode, function(err, fd) {
            if (err) {
              if (callback)
                callback(err);
              return;
            }
            fs3.fchmod(fd, mode, function(err2) {
              fs3.close(fd, function(err22) {
                if (callback)
                  callback(err2 || err22);
              });
            });
          });
        };
        fs3.lchmodSync = function(path2, mode) {
          var fd = fs3.openSync(path2, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs3.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs3.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs3.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs3) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs3.futimes) {
          fs3.lutimes = function(path2, at, mt, cb) {
            fs3.open(path2, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb)
                  cb(er);
                return;
              }
              fs3.futimes(fd, at, mt, function(er2) {
                fs3.close(fd, function(er22) {
                  if (cb)
                    cb(er2 || er22);
                });
              });
            });
          };
          fs3.lutimesSync = function(path2, at, mt) {
            var fd = fs3.openSync(path2, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs3.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs3.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs3.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs3.futimes) {
          fs3.lutimes = function(_a, _b, _c, cb) {
            if (cb)
              process.nextTick(cb);
          };
          fs3.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig)
          return orig;
        return function(target, mode, cb) {
          return orig.call(fs2, target, mode, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, mode) {
          try {
            return orig.call(fs2, target, mode);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs2, target, uid, gid, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs2, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig)
          return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0)
                stats.uid += 4294967296;
              if (stats.gid < 0)
                stats.gid += 4294967296;
            }
            if (cb)
              cb.apply(this, arguments);
          }
          return options ? orig.call(fs2, target, options, callback) : orig.call(fs2, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs2, target, options) : orig.call(fs2, target);
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.10/node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.10/node_modules/graceful-fs/legacy-streams.js"(exports, module2) {
    var Stream = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs2) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path2, options) {
        if (!(this instanceof ReadStream))
          return new ReadStream(path2, options);
        Stream.call(this);
        var self = this;
        this.path = path2;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding)
          this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self._read();
          });
          return;
        }
        fs2.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self.emit("error", err);
            self.readable = false;
            return;
          }
          self.fd = fd;
          self.emit("open", fd);
          self._read();
        });
      }
      function WriteStream(path2, options) {
        if (!(this instanceof WriteStream))
          return new WriteStream(path2, options);
        Stream.call(this);
        this.path = path2;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs2.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.10/node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.10/node_modules/graceful-fs/clone.js"(exports, module2) {
    "use strict";
    module2.exports = clone2;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone2(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy2 = { __proto__: getPrototypeOf(obj) };
      else
        var copy2 = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy2, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy2;
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.10/node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.10/node_modules/graceful-fs/graceful-fs.js"(exports, module2) {
    var fs2 = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone2 = require_clone();
    var util2 = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop4() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop4;
    if (util2.debuglog)
      debug = util2.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util2.format.apply(util2, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs2[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs2, queue);
      fs2.close = function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs2, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      }(fs2.close);
      fs2.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs2, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      }(fs2.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs2[gracefulQueue]);
          require("assert").equal(fs2[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs2[gracefulQueue]);
    }
    module2.exports = patch2(clone2(fs2));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs2.__patched) {
      module2.exports = patch2(fs2);
      fs2.__patched = true;
    }
    function patch2(fs3) {
      polyfills(fs3);
      fs3.gracefulify = patch2;
      fs3.createReadStream = createReadStream;
      fs3.createWriteStream = createWriteStream;
      var fs$readFile = fs3.readFile;
      fs3.readFile = readFile2;
      function readFile2(path2, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path2, options, cb);
        function go$readFile(path3, options2, cb2, startTime) {
          return fs$readFile(path3, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path3, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs3.writeFile;
      fs3.writeFile = writeFile2;
      function writeFile2(path2, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path2, data, options, cb);
        function go$writeFile(path3, data2, options2, cb2, startTime) {
          return fs$writeFile(path3, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs3.appendFile;
      if (fs$appendFile)
        fs3.appendFile = appendFile;
      function appendFile(path2, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path2, data, options, cb);
        function go$appendFile(path3, data2, options2, cb2, startTime) {
          return fs$appendFile(path3, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs3.copyFile;
      if (fs$copyFile)
        fs3.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs3.readdir;
      fs3.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path2, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path3, options2, cb2, startTime) {
          return fs$readdir(path3, fs$readdirCallback(path3, options2, cb2, startTime));
        } : function go$readdir2(path3, options2, cb2, startTime) {
          return fs$readdir(path3, options2, fs$readdirCallback(path3, options2, cb2, startTime));
        };
        return go$readdir(path2, options, cb);
        function fs$readdirCallback(path3, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path3, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs3);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs3.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs3.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs3, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs3, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs3, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs3, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path2, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path2, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path2, options) {
        return new fs3.ReadStream(path2, options);
      }
      function createWriteStream(path2, options) {
        return new fs3.WriteStream(path2, options);
      }
      var fs$open = fs3.open;
      fs3.open = open;
      function open(path2, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path2, flags, mode, cb);
        function go$open(path3, flags2, mode2, cb2, startTime) {
          return fs$open(path3, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path3, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs3;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs2[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs2[gracefulQueue].length; ++i) {
        if (fs2[gracefulQueue][i].length > 2) {
          fs2[gracefulQueue][i][3] = now;
          fs2[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs2[gracefulQueue].length === 0)
        return;
      var elem = fs2[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs2[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/fs/index.js"(exports) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs2 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs2[key] === "function";
    });
    Object.assign(exports, fs2);
    api.forEach((method) => {
      exports[method] = u(fs2[method]);
    });
    exports.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs2.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs2.exists(filename, resolve);
      });
    };
    exports.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs2.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs2.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs2.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs2.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    if (typeof fs2.writev === "function") {
      exports.writev = function(fd, buffers, ...args) {
        if (typeof args[args.length - 1] === "function") {
          return fs2.writev(fd, buffers, ...args);
        }
        return new Promise((resolve, reject) => {
          fs2.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
            if (err)
              return reject(err);
            resolve({ bytesWritten, buffers: buffers2 });
          });
        });
      };
    }
    if (typeof fs2.realpath.native === "function") {
      exports.realpath.native = u(fs2.realpath.native);
    } else {
      process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
    }
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/mkdirs/utils.js"(exports, module2) {
    "use strict";
    var path2 = require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path2.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports, module2) {
    "use strict";
    var fs2 = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number")
        return options;
      return { ...defaults, ...options }.mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs2.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs2.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/mkdirs/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir();
    var makeDir = u(_makeDir);
    module2.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/path-exists/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs2 = require_fs();
    function pathExists(path2) {
      return fs2.access(path2).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs2.existsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/util/utimes.js"(exports, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    function utimesMillis(path2, atime, mtime, callback) {
      fs2.open(path2, "r+", (err, fd) => {
        if (err)
          return callback(err);
        fs2.futimes(fd, atime, mtime, (futimesErr) => {
          fs2.close(fd, (closeErr) => {
            if (callback)
              callback(futimesErr || closeErr);
          });
        });
      });
    }
    function utimesMillisSync(path2, atime, mtime) {
      const fd = fs2.openSync(path2, "r+");
      fs2.futimesSync(fd, atime, mtime);
      return fs2.closeSync(fd);
    }
    module2.exports = {
      utimesMillis,
      utimesMillisSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/util/stat.js"(exports, module2) {
    "use strict";
    var fs2 = require_fs();
    var path2 = require("path");
    var util2 = require("util");
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs2.stat(file, { bigint: true }) : (file) => fs2.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT")
            return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts) {
      let destStat;
      const statFunc = opts.dereference ? (file) => fs2.statSync(file, { bigint: true }) : (file) => fs2.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT")
          return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    function checkPaths(src, dest, funcName, opts, cb) {
      util2.callbackify(getStats)(src, dest, opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        if (destStat) {
          if (areIdentical(srcStat, destStat)) {
            const srcBaseName = path2.basename(src);
            const destBaseName = path2.basename(dest);
            if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
              return cb(null, { srcStat, destStat, isChangingCase: true });
            }
            return cb(new Error("Source and destination must not be the same."));
          }
          if (srcStat.isDirectory() && !destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
          }
          if (!srcStat.isDirectory() && destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
          }
        }
        if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return cb(null, { srcStat, destStat });
      });
    }
    function checkPathsSync(src, dest, funcName, opts) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path2.basename(src);
          const destBaseName = path2.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkParentPaths(src, srcStat, dest, funcName, cb) {
      const srcParent = path2.resolve(path2.dirname(src));
      const destParent = path2.resolve(path2.dirname(dest));
      if (destParent === srcParent || destParent === path2.parse(destParent).root)
        return cb();
      fs2.stat(destParent, { bigint: true }, (err, destStat) => {
        if (err) {
          if (err.code === "ENOENT")
            return cb();
          return cb(err);
        }
        if (areIdentical(srcStat, destStat)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return checkParentPaths(src, srcStat, destParent, funcName, cb);
      });
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path2.resolve(path2.dirname(src));
      const destParent = path2.resolve(path2.dirname(dest));
      if (destParent === srcParent || destParent === path2.parse(destParent).root)
        return;
      let destStat;
      try {
        destStat = fs2.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT")
          return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path2.resolve(src).split(path2.sep).filter((i) => i);
      const destArr = path2.resolve(dest).split(path2.sep).filter((i) => i);
      return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      checkPaths,
      checkPathsSync,
      checkParentPaths,
      checkParentPathsSync,
      isSrcSubdir,
      areIdentical
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/copy/copy.js"(exports, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var path2 = require("path");
    var mkdirs = require_mkdirs().mkdirs;
    var pathExists = require_path_exists().pathExists;
    var utimesMillis = require_utimes().utimesMillis;
    var stat = require_stat();
    function copy2(src, dest, opts, cb) {
      if (typeof opts === "function" && !cb) {
        cb = opts;
        opts = {};
      } else if (typeof opts === "function") {
        opts = { filter: opts };
      }
      cb = cb || function() {
      };
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001");
      }
      stat.checkPaths(src, dest, "copy", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        stat.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
          if (err2)
            return cb(err2);
          if (opts.filter)
            return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
          return checkParentDir(destStat, src, dest, opts, cb);
        });
      });
    }
    function checkParentDir(destStat, src, dest, opts, cb) {
      const destParent = path2.dirname(dest);
      pathExists(destParent, (err, dirExists) => {
        if (err)
          return cb(err);
        if (dirExists)
          return getStats(destStat, src, dest, opts, cb);
        mkdirs(destParent, (err2) => {
          if (err2)
            return cb(err2);
          return getStats(destStat, src, dest, opts, cb);
        });
      });
    }
    function handleFilter(onInclude, destStat, src, dest, opts, cb) {
      Promise.resolve(opts.filter(src, dest)).then((include) => {
        if (include)
          return onInclude(destStat, src, dest, opts, cb);
        return cb();
      }, (error) => cb(error));
    }
    function startCopy(destStat, src, dest, opts, cb) {
      if (opts.filter)
        return handleFilter(getStats, destStat, src, dest, opts, cb);
      return getStats(destStat, src, dest, opts, cb);
    }
    function getStats(destStat, src, dest, opts, cb) {
      const stat2 = opts.dereference ? fs2.stat : fs2.lstat;
      stat2(src, (err, srcStat) => {
        if (err)
          return cb(err);
        if (srcStat.isDirectory())
          return onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
          return onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink())
          return onLink(destStat, src, dest, opts, cb);
        else if (srcStat.isSocket())
          return cb(new Error(`Cannot copy a socket file: ${src}`));
        else if (srcStat.isFIFO())
          return cb(new Error(`Cannot copy a FIFO pipe: ${src}`));
        return cb(new Error(`Unknown file: ${src}`));
      });
    }
    function onFile(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts, cb);
      return mayCopyFile(srcStat, src, dest, opts, cb);
    }
    function mayCopyFile(srcStat, src, dest, opts, cb) {
      if (opts.overwrite) {
        fs2.unlink(dest, (err) => {
          if (err)
            return cb(err);
          return copyFile(srcStat, src, dest, opts, cb);
        });
      } else if (opts.errorOnExist) {
        return cb(new Error(`'${dest}' already exists`));
      } else
        return cb();
    }
    function copyFile(srcStat, src, dest, opts, cb) {
      fs2.copyFile(src, dest, (err) => {
        if (err)
          return cb(err);
        if (opts.preserveTimestamps)
          return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
        return setDestMode(dest, srcStat.mode, cb);
      });
    }
    function handleTimestampsAndMode(srcMode, src, dest, cb) {
      if (fileIsNotWritable(srcMode)) {
        return makeFileWritable(dest, srcMode, (err) => {
          if (err)
            return cb(err);
          return setDestTimestampsAndMode(srcMode, src, dest, cb);
        });
      }
      return setDestTimestampsAndMode(srcMode, src, dest, cb);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode, cb) {
      return setDestMode(dest, srcMode | 128, cb);
    }
    function setDestTimestampsAndMode(srcMode, src, dest, cb) {
      setDestTimestamps(src, dest, (err) => {
        if (err)
          return cb(err);
        return setDestMode(dest, srcMode, cb);
      });
    }
    function setDestMode(dest, srcMode, cb) {
      return fs2.chmod(dest, srcMode, cb);
    }
    function setDestTimestamps(src, dest, cb) {
      fs2.stat(src, (err, updatedSrcStat) => {
        if (err)
          return cb(err);
        return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
      });
    }
    function onDir(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
      return copyDir(src, dest, opts, cb);
    }
    function mkDirAndCopy(srcMode, src, dest, opts, cb) {
      fs2.mkdir(dest, (err) => {
        if (err)
          return cb(err);
        copyDir(src, dest, opts, (err2) => {
          if (err2)
            return cb(err2);
          return setDestMode(dest, srcMode, cb);
        });
      });
    }
    function copyDir(src, dest, opts, cb) {
      fs2.readdir(src, (err, items) => {
        if (err)
          return cb(err);
        return copyDirItems(items, src, dest, opts, cb);
      });
    }
    function copyDirItems(items, src, dest, opts, cb) {
      const item = items.pop();
      if (!item)
        return cb();
      return copyDirItem(items, item, src, dest, opts, cb);
    }
    function copyDirItem(items, item, src, dest, opts, cb) {
      const srcItem = path2.join(src, item);
      const destItem = path2.join(dest, item);
      stat.checkPaths(srcItem, destItem, "copy", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { destStat } = stats;
        startCopy(destStat, srcItem, destItem, opts, (err2) => {
          if (err2)
            return cb(err2);
          return copyDirItems(items, src, dest, opts, cb);
        });
      });
    }
    function onLink(destStat, src, dest, opts, cb) {
      fs2.readlink(src, (err, resolvedSrc) => {
        if (err)
          return cb(err);
        if (opts.dereference) {
          resolvedSrc = path2.resolve(process.cwd(), resolvedSrc);
        }
        if (!destStat) {
          return fs2.symlink(resolvedSrc, dest, cb);
        } else {
          fs2.readlink(dest, (err2, resolvedDest) => {
            if (err2) {
              if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
                return fs2.symlink(resolvedSrc, dest, cb);
              return cb(err2);
            }
            if (opts.dereference) {
              resolvedDest = path2.resolve(process.cwd(), resolvedDest);
            }
            if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
              return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
            }
            if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
              return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
            }
            return copyLink(resolvedSrc, dest, cb);
          });
        }
      });
    }
    function copyLink(resolvedSrc, dest, cb) {
      fs2.unlink(dest, (err) => {
        if (err)
          return cb(err);
        return fs2.symlink(resolvedSrc, dest, cb);
      });
    }
    module2.exports = copy2;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/copy/copy-sync.js"(exports, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var path2 = require("path");
    var mkdirsSync = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat = require_stat();
    function copySync(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
      }
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      return handleFilterAndCopy(destStat, src, dest, opts);
    }
    function handleFilterAndCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest))
        return;
      const destParent = path2.dirname(dest);
      if (!fs2.existsSync(destParent))
        mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function startCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest))
        return;
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs2.statSync : fs2.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts);
      else if (srcStat.isSocket())
        throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO())
        throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs2.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      fs2.copyFileSync(src, dest);
      if (opts.preserveTimestamps)
        handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode))
        makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs2.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs2.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs2.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      fs2.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path2.join(src, item);
      const destItem = path2.join(dest, item);
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
      return startCopy(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs2.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path2.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs2.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs2.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN")
            return fs2.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path2.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (fs2.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs2.unlinkSync(dest);
      return fs2.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/copy/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      copy: u(require_copy()),
      copySync: require_copy_sync()
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/remove/rimraf.js
var require_rimraf = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/remove/rimraf.js"(exports, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var path2 = require("path");
    var assert = require("assert");
    var isWindows = process.platform === "win32";
    function defaults(options) {
      const methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach((m) => {
        options[m] = options[m] || fs2[m];
        m = m + "Sync";
        options[m] = options[m] || fs2[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
    }
    function rimraf(p, options, cb) {
      let busyTries = 0;
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      defaults(options);
      rimraf_(p, options, function CB(er) {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
            busyTries++;
            const time = busyTries * 100;
            return setTimeout(() => rimraf_(p, options, CB), time);
          }
          if (er.code === "ENOENT")
            er = null;
        }
        cb(er);
      });
    }
    function rimraf_(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, (er, st) => {
        if (er && er.code === "ENOENT") {
          return cb(null);
        }
        if (er && er.code === "EPERM" && isWindows) {
          return fixWinEPERM(p, options, er, cb);
        }
        if (st && st.isDirectory()) {
          return rmdir(p, options, er, cb);
        }
        options.unlink(p, (er2) => {
          if (er2) {
            if (er2.code === "ENOENT") {
              return cb(null);
            }
            if (er2.code === "EPERM") {
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            }
            if (er2.code === "EISDIR") {
              return rmdir(p, options, er2, cb);
            }
          }
          return cb(er2);
        });
      });
    }
    function fixWinEPERM(p, options, er, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.chmod(p, 438, (er2) => {
        if (er2) {
          cb(er2.code === "ENOENT" ? null : er);
        } else {
          options.stat(p, (er3, stats) => {
            if (er3) {
              cb(er3.code === "ENOENT" ? null : er);
            } else if (stats.isDirectory()) {
              rmdir(p, options, er, cb);
            } else {
              options.unlink(p, cb);
            }
          });
        }
      });
    }
    function fixWinEPERMSync(p, options, er) {
      let stats;
      assert(p);
      assert(options);
      try {
        options.chmodSync(p, 438);
      } catch (er2) {
        if (er2.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      try {
        stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      if (stats.isDirectory()) {
        rmdirSync(p, options, er);
      } else {
        options.unlinkSync(p);
      }
    }
    function rmdir(p, options, originalEr, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.rmdir(p, (er) => {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
          rmkids(p, options, cb);
        } else if (er && er.code === "ENOTDIR") {
          cb(originalEr);
        } else {
          cb(er);
        }
      });
    }
    function rmkids(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, (er, files) => {
        if (er)
          return cb(er);
        let n = files.length;
        let errState;
        if (n === 0)
          return options.rmdir(p, cb);
        files.forEach((f) => {
          rimraf(path2.join(p, f), options, (er2) => {
            if (errState) {
              return;
            }
            if (er2)
              return cb(errState = er2);
            if (--n === 0) {
              options.rmdir(p, cb);
            }
          });
        });
      });
    }
    function rimrafSync(p, options) {
      let st;
      options = options || {};
      defaults(options);
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      try {
        st = options.lstatSync(p);
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        }
        if (er.code === "EPERM" && isWindows) {
          fixWinEPERMSync(p, options, er);
        }
      }
      try {
        if (st && st.isDirectory()) {
          rmdirSync(p, options, null);
        } else {
          options.unlinkSync(p);
        }
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        } else if (er.code === "EPERM") {
          return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
        } else if (er.code !== "EISDIR") {
          throw er;
        }
        rmdirSync(p, options, er);
      }
    }
    function rmdirSync(p, options, originalEr) {
      assert(p);
      assert(options);
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOTDIR") {
          throw originalEr;
        } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
          rmkidsSync(p, options);
        } else if (er.code !== "ENOENT") {
          throw er;
        }
      }
    }
    function rmkidsSync(p, options) {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach((f) => rimrafSync(path2.join(p, f), options));
      if (isWindows) {
        const startTime = Date.now();
        do {
          try {
            const ret = options.rmdirSync(p, options);
            return ret;
          } catch {
          }
        } while (Date.now() - startTime < 500);
      } else {
        const ret = options.rmdirSync(p, options);
        return ret;
      }
    }
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/remove/index.js"(exports, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var u = require_universalify().fromCallback;
    var rimraf = require_rimraf();
    function remove(path2, callback) {
      if (fs2.rm)
        return fs2.rm(path2, { recursive: true, force: true }, callback);
      rimraf(path2, callback);
    }
    function removeSync(path2) {
      if (fs2.rmSync)
        return fs2.rmSync(path2, { recursive: true, force: true });
      rimraf.sync(path2);
    }
    module2.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/empty/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs2 = require_fs();
    var path2 = require("path");
    var mkdir = require_mkdirs();
    var remove = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs2.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path2.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs2.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path2.join(dir, item);
        remove.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/file.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path2 = require("path");
    var fs2 = require_graceful_fs();
    var mkdir = require_mkdirs();
    function createFile(file, callback) {
      function makeFile() {
        fs2.writeFile(file, "", (err) => {
          if (err)
            return callback(err);
          callback();
        });
      }
      fs2.stat(file, (err, stats) => {
        if (!err && stats.isFile())
          return callback();
        const dir = path2.dirname(file);
        fs2.stat(dir, (err2, stats2) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              return mkdir.mkdirs(dir, (err3) => {
                if (err3)
                  return callback(err3);
                makeFile();
              });
            }
            return callback(err2);
          }
          if (stats2.isDirectory())
            makeFile();
          else {
            fs2.readdir(dir, (err3) => {
              if (err3)
                return callback(err3);
            });
          }
        });
      });
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs2.statSync(file);
      } catch {
      }
      if (stats && stats.isFile())
        return;
      const dir = path2.dirname(file);
      try {
        if (!fs2.statSync(dir).isDirectory()) {
          fs2.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT")
          mkdir.mkdirsSync(dir);
        else
          throw err;
      }
      fs2.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/link.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path2 = require("path");
    var fs2 = require_graceful_fs();
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    var { areIdentical } = require_stat();
    function createLink(srcpath, dstpath, callback) {
      function makeLink(srcpath2, dstpath2) {
        fs2.link(srcpath2, dstpath2, (err) => {
          if (err)
            return callback(err);
          callback(null);
        });
      }
      fs2.lstat(dstpath, (_, dstStat) => {
        fs2.lstat(srcpath, (err, srcStat) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureLink");
            return callback(err);
          }
          if (dstStat && areIdentical(srcStat, dstStat))
            return callback(null);
          const dir = path2.dirname(dstpath);
          pathExists(dir, (err2, dirExists) => {
            if (err2)
              return callback(err2);
            if (dirExists)
              return makeLink(srcpath, dstpath);
            mkdir.mkdirs(dir, (err3) => {
              if (err3)
                return callback(err3);
              makeLink(srcpath, dstpath);
            });
          });
        });
      });
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs2.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs2.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat))
          return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path2.dirname(dstpath);
      const dirExists = fs2.existsSync(dir);
      if (dirExists)
        return fs2.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs2.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports, module2) {
    "use strict";
    var path2 = require("path");
    var fs2 = require_graceful_fs();
    var pathExists = require_path_exists().pathExists;
    function symlinkPaths(srcpath, dstpath, callback) {
      if (path2.isAbsolute(srcpath)) {
        return fs2.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureSymlink");
            return callback(err);
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: srcpath
          });
        });
      } else {
        const dstdir = path2.dirname(dstpath);
        const relativeToDst = path2.join(dstdir, srcpath);
        return pathExists(relativeToDst, (err, exists) => {
          if (err)
            return callback(err);
          if (exists) {
            return callback(null, {
              toCwd: relativeToDst,
              toDst: srcpath
            });
          } else {
            return fs2.lstat(srcpath, (err2) => {
              if (err2) {
                err2.message = err2.message.replace("lstat", "ensureSymlink");
                return callback(err2);
              }
              return callback(null, {
                toCwd: srcpath,
                toDst: path2.relative(dstdir, srcpath)
              });
            });
          }
        });
      }
    }
    function symlinkPathsSync(srcpath, dstpath) {
      let exists;
      if (path2.isAbsolute(srcpath)) {
        exists = fs2.existsSync(srcpath);
        if (!exists)
          throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      } else {
        const dstdir = path2.dirname(dstpath);
        const relativeToDst = path2.join(dstdir, srcpath);
        exists = fs2.existsSync(relativeToDst);
        if (exists) {
          return {
            toCwd: relativeToDst,
            toDst: srcpath
          };
        } else {
          exists = fs2.existsSync(srcpath);
          if (!exists)
            throw new Error("relative srcpath does not exist");
          return {
            toCwd: srcpath,
            toDst: path2.relative(dstdir, srcpath)
          };
        }
      }
    }
    module2.exports = {
      symlinkPaths,
      symlinkPathsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    function symlinkType(srcpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      if (type)
        return callback(null, type);
      fs2.lstat(srcpath, (err, stats) => {
        if (err)
          return callback(null, "file");
        type = stats && stats.isDirectory() ? "dir" : "file";
        callback(null, type);
      });
    }
    function symlinkTypeSync(srcpath, type) {
      let stats;
      if (type)
        return type;
      try {
        stats = fs2.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType,
      symlinkTypeSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/symlink.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path2 = require("path");
    var fs2 = require_fs();
    var _mkdirs = require_mkdirs();
    var mkdirs = _mkdirs.mkdirs;
    var mkdirsSync = _mkdirs.mkdirsSync;
    var _symlinkPaths = require_symlink_paths();
    var symlinkPaths = _symlinkPaths.symlinkPaths;
    var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
    var _symlinkType = require_symlink_type();
    var symlinkType = _symlinkType.symlinkType;
    var symlinkTypeSync = _symlinkType.symlinkTypeSync;
    var pathExists = require_path_exists().pathExists;
    var { areIdentical } = require_stat();
    function createSymlink(srcpath, dstpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      fs2.lstat(dstpath, (err, stats) => {
        if (!err && stats.isSymbolicLink()) {
          Promise.all([
            fs2.stat(srcpath),
            fs2.stat(dstpath)
          ]).then(([srcStat, dstStat]) => {
            if (areIdentical(srcStat, dstStat))
              return callback(null);
            _createSymlink(srcpath, dstpath, type, callback);
          });
        } else
          _createSymlink(srcpath, dstpath, type, callback);
      });
    }
    function _createSymlink(srcpath, dstpath, type, callback) {
      symlinkPaths(srcpath, dstpath, (err, relative) => {
        if (err)
          return callback(err);
        srcpath = relative.toDst;
        symlinkType(relative.toCwd, type, (err2, type2) => {
          if (err2)
            return callback(err2);
          const dir = path2.dirname(dstpath);
          pathExists(dir, (err3, dirExists) => {
            if (err3)
              return callback(err3);
            if (dirExists)
              return fs2.symlink(srcpath, dstpath, type2, callback);
            mkdirs(dir, (err4) => {
              if (err4)
                return callback(err4);
              fs2.symlink(srcpath, dstpath, type2, callback);
            });
          });
        });
      });
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs2.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs2.statSync(srcpath);
        const dstStat = fs2.statSync(dstpath);
        if (areIdentical(srcStat, dstStat))
          return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path2.dirname(dstpath);
      const exists = fs2.existsSync(dir);
      if (exists)
        return fs2.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs2.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/ensure/index.js"(exports, module2) {
    "use strict";
    var { createFile, createFileSync } = require_file();
    var { createLink, createLinkSync } = require_link();
    var { createSymlink, createSymlinkSync } = require_symlink();
    module2.exports = {
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// node_modules/.pnpm/jsonfile@6.1.0/node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "node_modules/.pnpm/jsonfile@6.1.0/node_modules/jsonfile/utils.js"(exports, module2) {
    function stringify(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
      const EOF3 = finalEOL ? EOL : "";
      const str = JSON.stringify(obj, replacer, spaces);
      return str.replace(/\n/g, EOL) + EOF3;
    }
    function stripBom(content) {
      if (Buffer.isBuffer(content))
        content = content.toString("utf8");
      return content.replace(/^\uFEFF/, "");
    }
    module2.exports = { stringify, stripBom };
  }
});

// node_modules/.pnpm/jsonfile@6.1.0/node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "node_modules/.pnpm/jsonfile@6.1.0/node_modules/jsonfile/index.js"(exports, module2) {
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = require("fs");
    }
    var universalify = require_universalify();
    var { stringify, stripBom } = require_utils2();
    async function _readFile(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs2 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs2.readFile)(file, options);
      data = stripBom(data);
      let obj;
      try {
        obj = JSON.parse(data, options ? options.reviver : null);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
      return obj;
    }
    var readFile2 = universalify.fromPromise(_readFile);
    function readFileSync(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs2 = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs2.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
    }
    async function _writeFile(file, obj, options = {}) {
      const fs2 = options.fs || _fs;
      const str = stringify(obj, options);
      await universalify.fromCallback(fs2.writeFile)(file, str, options);
    }
    var writeFile2 = universalify.fromPromise(_writeFile);
    function writeFileSync(file, obj, options = {}) {
      const fs2 = options.fs || _fs;
      const str = stringify(obj, options);
      return fs2.writeFileSync(file, str, options);
    }
    var jsonfile = {
      readFile: readFile2,
      readFileSync,
      writeFile: writeFile2,
      writeFileSync
    };
    module2.exports = jsonfile;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/json/jsonfile.js"(exports, module2) {
    "use strict";
    var jsonFile = require_jsonfile();
    module2.exports = {
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/output-file/index.js
var require_output_file = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/output-file/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs2 = require_graceful_fs();
    var path2 = require("path");
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    function outputFile(file, data, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      const dir = path2.dirname(file);
      pathExists(dir, (err, itDoes) => {
        if (err)
          return callback(err);
        if (itDoes)
          return fs2.writeFile(file, data, encoding, callback);
        mkdir.mkdirs(dir, (err2) => {
          if (err2)
            return callback(err2);
          fs2.writeFile(file, data, encoding, callback);
        });
      });
    }
    function outputFileSync(file, ...args) {
      const dir = path2.dirname(file);
      if (fs2.existsSync(dir)) {
        return fs2.writeFileSync(file, ...args);
      }
      mkdir.mkdirsSync(dir);
      fs2.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/json/output-json.js"(exports, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFile } = require_output_file();
    async function outputJson(file, data, options = {}) {
      const str = stringify(data, options);
      await outputFile(file, str, options);
    }
    module2.exports = outputJson;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/json/output-json-sync.js"(exports, module2) {
    "use strict";
    var { stringify } = require_utils2();
    var { outputFileSync } = require_output_file();
    function outputJsonSync(file, data, options) {
      const str = stringify(data, options);
      outputFileSync(file, str, options);
    }
    module2.exports = outputJsonSync;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/json/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/move/move.js"(exports, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var path2 = require("path");
    var copy2 = require_copy2().copy;
    var remove = require_remove().remove;
    var mkdirp = require_mkdirs().mkdirp;
    var pathExists = require_path_exists().pathExists;
    var stat = require_stat();
    function move(src, dest, opts, cb) {
      if (typeof opts === "function") {
        cb = opts;
        opts = {};
      }
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      stat.checkPaths(src, dest, "move", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, isChangingCase = false } = stats;
        stat.checkParentPaths(src, srcStat, dest, "move", (err2) => {
          if (err2)
            return cb(err2);
          if (isParentRoot(dest))
            return doRename(src, dest, overwrite, isChangingCase, cb);
          mkdirp(path2.dirname(dest), (err3) => {
            if (err3)
              return cb(err3);
            return doRename(src, dest, overwrite, isChangingCase, cb);
          });
        });
      });
    }
    function isParentRoot(dest) {
      const parent = path2.dirname(dest);
      const parsedPath = path2.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase, cb) {
      if (isChangingCase)
        return rename(src, dest, overwrite, cb);
      if (overwrite) {
        return remove(dest, (err) => {
          if (err)
            return cb(err);
          return rename(src, dest, overwrite, cb);
        });
      }
      pathExists(dest, (err, destExists) => {
        if (err)
          return cb(err);
        if (destExists)
          return cb(new Error("dest already exists."));
        return rename(src, dest, overwrite, cb);
      });
    }
    function rename(src, dest, overwrite, cb) {
      fs2.rename(src, dest, (err) => {
        if (!err)
          return cb();
        if (err.code !== "EXDEV")
          return cb(err);
        return moveAcrossDevice(src, dest, overwrite, cb);
      });
    }
    function moveAcrossDevice(src, dest, overwrite, cb) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copy2(src, dest, opts, (err) => {
        if (err)
          return cb(err);
        return remove(src, cb);
      });
    }
    module2.exports = move;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/move/move-sync.js"(exports, module2) {
    "use strict";
    var fs2 = require_graceful_fs();
    var path2 = require("path");
    var copySync = require_copy2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat = require_stat();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest))
        mkdirpSync(path2.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path2.dirname(dest);
      const parsedPath = path2.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase)
        return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs2.existsSync(dest))
        throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs2.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV")
          throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copySync(src, dest, opts);
      return removeSync(src);
    }
    module2.exports = moveSync;
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/move/index.js"(exports, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      move: u(require_move()),
      moveSync: require_move_sync()
    };
  }
});

// node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/fs-extra@10.1.0/node_modules/fs-extra/lib/index.js"(exports, module2) {
    "use strict";
    module2.exports = {
      ...require_fs(),
      ...require_copy2(),
      ...require_empty(),
      ...require_ensure(),
      ...require_json(),
      ...require_mkdirs(),
      ...require_move2(),
      ...require_output_file(),
      ...require_path_exists(),
      ...require_remove()
    };
  }
});

// node_modules/.pnpm/fs.realpath@1.0.0/node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/.pnpm/fs.realpath@1.0.0/node_modules/fs.realpath/old.js"(exports) {
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs2 = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    var normalize = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports.realpathSync = function realpathSync(p, cache) {
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs2.lstatSync(base);
          knownHard[base] = true;
        }
      }
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          resolvedLink = cache[base];
        } else {
          var stat = fs2.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs2.statSync(base);
            linkTarget = fs2.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache)
            cache[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache)
        cache[original] = p;
      return p;
    };
    exports.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache);
        cache = null;
      }
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs2.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      function LOOP() {
        if (pos >= p.length) {
          if (cache)
            cache[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          return gotResolvedLink(cache[base]);
        }
        return fs2.lstat(base, gotStat);
      }
      function gotStat(err, stat) {
        if (err)
          return cb(err);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs2.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs2.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache)
          cache[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };
  }
});

// node_modules/.pnpm/fs.realpath@1.0.0/node_modules/fs.realpath/index.js
var require_fs2 = __commonJS({
  "node_modules/.pnpm/fs.realpath@1.0.0/node_modules/fs.realpath/index.js"(exports, module2) {
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs2 = require("fs");
    var origRealpath = fs2.realpath;
    var origRealpathSync = fs2.realpathSync;
    var version2 = process.version;
    var ok = /^v[0-5]\./.test(version2);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    function realpath(p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb);
      }
      if (typeof cache === "function") {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }
    function realpathSync(p, cache) {
      if (ok) {
        return origRealpathSync(p, cache);
      }
      try {
        return origRealpathSync(p, cache);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache);
        } else {
          throw er;
        }
      }
    }
    function monkeypatch() {
      fs2.realpath = realpath;
      fs2.realpathSync = realpathSync;
    }
    function unmonkeypatch() {
      fs2.realpath = origRealpath;
      fs2.realpathSync = origRealpathSync;
    }
  }
});

// node_modules/.pnpm/concat-map@0.0.1/node_modules/concat-map/index.js
var require_concat_map = __commonJS({
  "node_modules/.pnpm/concat-map@0.0.1/node_modules/concat-map/index.js"(exports, module2) {
    module2.exports = function(xs, fn) {
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x))
          res.push.apply(res, x);
        else
          res.push(x);
      }
      return res;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/.pnpm/balanced-match@1.0.2/node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/.pnpm/balanced-match@1.0.2/node_modules/balanced-match/index.js"(exports, module2) {
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/.pnpm/brace-expansion@1.1.11/node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/.pnpm/brace-expansion@1.1.11/node_modules/brace-expansion/index.js"(exports, module2) {
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m || /\$$/.test(m.pre))
        return [str];
      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(",") >= 0;
      if (!isSequence && !isOptions) {
        if (m.post.match(/,.*\}/)) {
          str = m.pre + "{" + m.body + escClose + m.post;
          return expand(str);
        }
        return [str];
      }
      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          n = expand(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length ? expand(m.post, false) : [""];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      var N6;
      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);
        N6 = [];
        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === "\\")
              c = "";
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join("0");
                if (i < 0)
                  c = "-" + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N6.push(c);
        }
      } else {
        N6 = concatMap(n, function(el) {
          return expand(el, false);
        });
      }
      for (var j = 0; j < N6.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N6[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }
      return expansions;
    }
  }
});

// node_modules/.pnpm/minimatch@3.1.2/node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/.pnpm/minimatch@3.1.2/node_modules/minimatch/minimatch.js"(exports, module2) {
    module2.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path2 = function() {
      try {
        return require("path");
      } catch (e) {
      }
    }() || {
      sep: "/"
    };
    minimatch.sep = path2.sep;
    var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
    var expand = require_brace_expansion();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set, c) {
        set[c] = true;
        return set;
      }, {});
    }
    var slashSplit = /\/+/;
    minimatch.filter = filter;
    function filter(pattern, options) {
      options = options || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options);
      };
    }
    function ext(a, b) {
      b = b || {};
      var t = {};
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      return t;
    }
    minimatch.defaults = function(def) {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return minimatch;
      }
      var orig = minimatch;
      var m = function minimatch2(p, pattern, options) {
        return orig(p, pattern, ext(def, options));
      };
      m.Minimatch = function Minimatch2(pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options));
      };
      m.Minimatch.defaults = function defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      };
      m.filter = function filter2(pattern, options) {
        return orig.filter(pattern, ext(def, options));
      };
      m.defaults = function defaults(options) {
        return orig.defaults(ext(def, options));
      };
      m.makeRe = function makeRe2(pattern, options) {
        return orig.makeRe(pattern, ext(def, options));
      };
      m.braceExpand = function braceExpand2(pattern, options) {
        return orig.braceExpand(pattern, ext(def, options));
      };
      m.match = function(list, pattern, options) {
        return orig.match(list, pattern, ext(def, options));
      };
      return m;
    };
    Minimatch.defaults = function(def) {
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options) {
      assertValidPattern(pattern);
      if (!options)
        options = {};
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern, options).match(p);
    }
    function Minimatch(pattern, options) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options);
      }
      assertValidPattern(pattern);
      if (!options)
        options = {};
      pattern = pattern.trim();
      if (!options.allowWindowsEscape && path2.sep !== "/") {
        pattern = pattern.split(path2.sep).join("/");
      }
      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.partial = !!options.partial;
      this.make();
    }
    Minimatch.prototype.debug = function() {
    };
    Minimatch.prototype.make = make;
    function make() {
      var pattern = this.pattern;
      var options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return;
      }
      if (!pattern) {
        this.empty = true;
        return;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      if (options.debug)
        this.debug = function debug() {
          console.error.apply(console, arguments);
        };
      this.debug(this.pattern, set);
      set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set);
      set = set.map(function(s, si, set2) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set);
      set = set.filter(function(s) {
        return s.indexOf(false) === -1;
      });
      this.debug(this.pattern, set);
      this.set = set;
    }
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern;
      var negate = false;
      var options = this.options;
      var negateOffset = 0;
      if (options.nonegate)
        return;
      for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    minimatch.braceExpand = function(pattern, options) {
      return braceExpand(pattern, options);
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options) {
      if (!options) {
        if (this instanceof Minimatch) {
          options = this.options;
        } else {
          options = {};
        }
      }
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      assertValidPattern(pattern);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        return [pattern];
      }
      return expand(pattern);
    }
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = function(pattern) {
      if (typeof pattern !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    Minimatch.prototype.parse = parse43;
    var SUBPARSE = {};
    function parse43(pattern, isSub) {
      assertValidPattern(pattern);
      var options = this.options;
      if (pattern === "**") {
        if (!options.noglobstar)
          return GLOBSTAR;
        else
          pattern = "*";
      }
      if (pattern === "")
        return "";
      var re = "";
      var hasMagic = !!options.nocase;
      var escaping = false;
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
      var self = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self.debug("clearStateChar %j %j", stateChar, re);
          stateChar = false;
        }
      }
      for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
        this.debug("%s	%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        switch (c) {
          case "/": {
            return false;
          }
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug("  in class");
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self.debug("call clearStateChar %j", stateChar);
            clearStateChar();
            stateChar = c;
            if (options.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
            this.debug("plType %j %j", stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            re += pl.close;
            if (pl.type === "!") {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp("[" + cs + "]");
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
              hasMagic = hasMagic || sp[1];
              inClass = false;
              continue;
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug("setting tail", re, pl);
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail, pl, re);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case "[":
        case ".":
        case "(":
          addPatternStart = true;
      }
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        var openParensBefore = nlBefore.split("(").length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
        }
        nlAfter = cleanAfter;
        var dollar = "";
        if (nlAfter === "" && isSub !== SUBPARSE) {
          dollar = "$";
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }
      if (re !== "" && hasMagic) {
        re = "(?=.)" + re;
      }
      if (addPatternStart) {
        re = patternStart + re;
      }
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags = options.nocase ? "i" : "";
      try {
        var regExp = new RegExp("^" + re + "$", flags);
      } catch (er) {
        return new RegExp("$.");
      }
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    minimatch.makeRe = function(pattern, options) {
      return new Minimatch(pattern, options || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set = this.set;
      if (!set.length) {
        this.regexp = false;
        return this.regexp;
      }
      var options = this.options;
      var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
      var flags = options.nocase ? "i" : "";
      var re = set.map(function(pattern) {
        return pattern.map(function(p) {
          return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
        }).join("\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        this.regexp = new RegExp(re, flags);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp;
    }
    minimatch.match = function(list, pattern, options) {
      options = options || {};
      var mm = new Minimatch(pattern, options);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = function match(f, partial) {
      if (typeof partial === "undefined")
        partial = this.partial;
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options = this.options;
      if (path2.sep !== "/") {
        f = f.split(path2.sep).join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set = this.set;
      this.debug(this.pattern, "set", set);
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename)
          break;
      }
      for (i = 0; i < set.length; i++) {
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options.flipNegate)
        return false;
      return this.negate;
    };
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options = this.options;
      this.debug("matchOne", { "this": this, file, pattern });
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug("GLOBSTAR", [pattern, p, f]);
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug("** at the end");
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                return false;
            }
            return true;
          }
          while (fr < fl) {
            var swallowee = file[fr];
            this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug("globstar found match!", fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                this.debug("dot detected!", file, fr, pattern, pr);
                break;
              }
              this.debug("globstar swallow a segment, and continue");
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          hit = f === p;
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        return fi === fl - 1 && file[fi] === "";
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  }
});

// node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js"(exports, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js"(exports, module2) {
    try {
      util2 = require("util");
      if (typeof util2.inherits !== "function")
        throw "";
      module2.exports = util2.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util2;
  }
});

// node_modules/.pnpm/path-is-absolute@1.0.1/node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/.pnpm/path-is-absolute@1.0.1/node_modules/path-is-absolute/index.js"(exports, module2) {
    "use strict";
    function posix(path2) {
      return path2.charAt(0) === "/";
    }
    function win32(path2) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path2);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    module2.exports = process.platform === "win32" ? win32 : posix;
    module2.exports.posix = posix;
    module2.exports.win32 = win32;
  }
});

// node_modules/.pnpm/glob@7.2.3/node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/.pnpm/glob@7.2.3/node_modules/glob/common.js"(exports) {
    exports.setopts = setopts;
    exports.ownProp = ownProp;
    exports.makeAbs = makeAbs;
    exports.finish = finish;
    exports.mark = mark;
    exports.isIgnored = isIgnored;
    exports.childrenIgnored = childrenIgnored;
    function ownProp(obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field);
    }
    var fs2 = require("fs");
    var path2 = require("path");
    var minimatch = require_minimatch();
    var isAbsolute = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self, options) {
      self.ignore = options.ignore || [];
      if (!Array.isArray(self.ignore))
        self.ignore = [self.ignore];
      if (self.ignore.length) {
        self.ignore = self.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self.silent = !!options.silent;
      self.pattern = pattern;
      self.strict = options.strict !== false;
      self.realpath = !!options.realpath;
      self.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
      self.follow = !!options.follow;
      self.dot = !!options.dot;
      self.mark = !!options.mark;
      self.nodir = !!options.nodir;
      if (self.nodir)
        self.mark = true;
      self.sync = !!options.sync;
      self.nounique = !!options.nounique;
      self.nonull = !!options.nonull;
      self.nosort = !!options.nosort;
      self.nocase = !!options.nocase;
      self.stat = !!options.stat;
      self.noprocess = !!options.noprocess;
      self.absolute = !!options.absolute;
      self.fs = options.fs || fs2;
      self.maxLength = options.maxLength || Infinity;
      self.cache = options.cache || /* @__PURE__ */ Object.create(null);
      self.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
      self.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
      setupIgnores(self, options);
      self.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self.cwd = cwd;
      else {
        self.cwd = path2.resolve(options.cwd);
        self.changedCwd = self.cwd !== cwd;
      }
      self.root = options.root || path2.resolve(self.cwd, "/");
      self.root = path2.resolve(self.root);
      if (process.platform === "win32")
        self.root = self.root.replace(/\\/g, "/");
      self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
      if (process.platform === "win32")
        self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
      self.nomount = !!options.nomount;
      options.nonegate = true;
      options.nocomment = true;
      options.allowWindowsEscape = false;
      self.minimatch = new Minimatch(pattern, options);
      self.options = self.minimatch.options;
    }
    function finish(self) {
      var nou = self.nounique;
      var all = nou ? [] : /* @__PURE__ */ Object.create(null);
      for (var i = 0, l = self.matches.length; i < l; i++) {
        var matches = self.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self.nonull) {
            var literal = self.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self.nosort)
        all = all.sort(alphasort);
      if (self.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self._mark(all[i]);
        }
        if (self.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self.cache[e] || self.cache[makeAbs(self, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self, m2);
        });
      self.found = all;
    }
    function mark(self, p) {
      var abs = makeAbs(self, p);
      var c = self.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self, m);
          self.statCache[mabs] = self.statCache[abs];
          self.cache[mabs] = self.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path2.join(self.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self.changedCwd) {
        abs = path2.resolve(self.cwd, f);
      } else {
        abs = path2.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self, path3) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return item.matcher.match(path3) || !!(item.gmatcher && item.gmatcher.match(path3));
      });
    }
    function childrenIgnored(self, path3) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path3));
      });
    }
  }
});

// node_modules/.pnpm/glob@7.2.3/node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/.pnpm/glob@7.2.3/node_modules/glob/sync.js"(exports, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs2();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util2 = require("util");
    var path2 = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert.ok(this instanceof GlobSync);
      if (this.realpath) {
        var self = this;
        this.matches.forEach(function(matchset, index) {
          var set = self.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var p in matchset) {
            try {
              p = self._makeAbs(p);
              var real = rp.realpathSync(p, self.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert.ok(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path2.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, this.fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path2.join(this.root, prefix);
        } else {
          prefix = path2.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = this.fs.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js"(exports, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/.pnpm/once@1.4.0/node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/.pnpm/once@1.4.0/node_modules/once/once.js"(exports, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name41 = fn.name || "Function wrapped with `once`";
      f.onceError = name41 + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/.pnpm/inflight@1.0.6/node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/.pnpm/inflight@1.0.6/node_modules/inflight/inflight.js"(exports, module2) {
    var wrappy = require_wrappy();
    var reqs = /* @__PURE__ */ Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    function makeres(key) {
      return once(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      });
    }
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i = 0; i < length; i++)
        array[i] = args[i];
      return array;
    }
  }
});

// node_modules/.pnpm/glob@7.2.3/node_modules/glob/glob.js
var require_glob = __commonJS({
  "node_modules/.pnpm/glob@7.2.3/node_modules/glob/glob.js"(exports, module2) {
    module2.exports = glob;
    var rp = require_fs2();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = require("events").EventEmitter;
    var path2 = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util2 = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;
    glob.glob = glob;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    glob.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob.Glob = Glob;
    inherits(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync = false;
      function done() {
        --self._processing;
        if (self._processing <= 0) {
          if (sync) {
            process.nextTick(function() {
              self._finish();
            });
          } else {
            self._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
      found.forEach(function(p, i) {
        p = self._makeAbs(p);
        rp.realpath(p, self.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self.emit("error", er);
          if (--n === 0) {
            self.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path2.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        self.fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self.cache[abs] = "FILE";
          cb();
        } else
          self._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self = this;
      self.fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self, abs, cb) {
      return function(er, entries) {
        if (er)
          self._readdirError(abs, er, cb);
        else
          self._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self = this;
      this._stat(prefix, function(er, exists) {
        self._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path2.join(this.root, prefix);
        } else {
          prefix = path2.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        self.fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return self.fs.stat(abs, function(er2, stat2) {
            if (er2)
              self._stat2(f, abs, null, lstat, cb);
            else
              self._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/.pnpm/rimraf@3.0.2/node_modules/rimraf/rimraf.js
var require_rimraf2 = __commonJS({
  "node_modules/.pnpm/rimraf@3.0.2/node_modules/rimraf/rimraf.js"(exports, module2) {
    var assert = require("assert");
    var path2 = require("path");
    var fs2 = require("fs");
    var glob = void 0;
    try {
      glob = require_glob();
    } catch (_err) {
    }
    var defaultGlobOpts = {
      nosort: true,
      silent: true
    };
    var timeout = 0;
    var isWindows = process.platform === "win32";
    var defaults = (options) => {
      const methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach((m) => {
        options[m] = options[m] || fs2[m];
        m = m + "Sync";
        options[m] = options[m] || fs2[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
      options.emfileWait = options.emfileWait || 1e3;
      if (options.glob === false) {
        options.disableGlob = true;
      }
      if (options.disableGlob !== true && glob === void 0) {
        throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
      }
      options.disableGlob = options.disableGlob || false;
      options.glob = options.glob || defaultGlobOpts;
    };
    var rimraf = (p, options, cb) => {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.equal(typeof p, "string", "rimraf: path should be a string");
      assert.equal(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.equal(typeof options, "object", "rimraf: options should be object");
      defaults(options);
      let busyTries = 0;
      let errState = null;
      let n = 0;
      const next = (er) => {
        errState = errState || er;
        if (--n === 0)
          cb(errState);
      };
      const afterGlob = (er, results) => {
        if (er)
          return cb(er);
        n = results.length;
        if (n === 0)
          return cb();
        results.forEach((p2) => {
          const CB = (er2) => {
            if (er2) {
              if ((er2.code === "EBUSY" || er2.code === "ENOTEMPTY" || er2.code === "EPERM") && busyTries < options.maxBusyTries) {
                busyTries++;
                return setTimeout(() => rimraf_(p2, options, CB), busyTries * 100);
              }
              if (er2.code === "EMFILE" && timeout < options.emfileWait) {
                return setTimeout(() => rimraf_(p2, options, CB), timeout++);
              }
              if (er2.code === "ENOENT")
                er2 = null;
            }
            timeout = 0;
            next(er2);
          };
          rimraf_(p2, options, CB);
        });
      };
      if (options.disableGlob || !glob.hasMagic(p))
        return afterGlob(null, [p]);
      options.lstat(p, (er, stat) => {
        if (!er)
          return afterGlob(null, [p]);
        glob(p, options.glob, afterGlob);
      });
    };
    var rimraf_ = (p, options, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, (er, st) => {
        if (er && er.code === "ENOENT")
          return cb(null);
        if (er && er.code === "EPERM" && isWindows)
          fixWinEPERM(p, options, er, cb);
        if (st && st.isDirectory())
          return rmdir(p, options, er, cb);
        options.unlink(p, (er2) => {
          if (er2) {
            if (er2.code === "ENOENT")
              return cb(null);
            if (er2.code === "EPERM")
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            if (er2.code === "EISDIR")
              return rmdir(p, options, er2, cb);
          }
          return cb(er2);
        });
      });
    };
    var fixWinEPERM = (p, options, er, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.chmod(p, 438, (er2) => {
        if (er2)
          cb(er2.code === "ENOENT" ? null : er);
        else
          options.stat(p, (er3, stats) => {
            if (er3)
              cb(er3.code === "ENOENT" ? null : er);
            else if (stats.isDirectory())
              rmdir(p, options, er, cb);
            else
              options.unlink(p, cb);
          });
      });
    };
    var fixWinEPERMSync = (p, options, er) => {
      assert(p);
      assert(options);
      try {
        options.chmodSync(p, 438);
      } catch (er2) {
        if (er2.code === "ENOENT")
          return;
        else
          throw er;
      }
      let stats;
      try {
        stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT")
          return;
        else
          throw er;
      }
      if (stats.isDirectory())
        rmdirSync(p, options, er);
      else
        options.unlinkSync(p);
    };
    var rmdir = (p, options, originalEr, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.rmdir(p, (er) => {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
          rmkids(p, options, cb);
        else if (er && er.code === "ENOTDIR")
          cb(originalEr);
        else
          cb(er);
      });
    };
    var rmkids = (p, options, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, (er, files) => {
        if (er)
          return cb(er);
        let n = files.length;
        if (n === 0)
          return options.rmdir(p, cb);
        let errState;
        files.forEach((f) => {
          rimraf(path2.join(p, f), options, (er2) => {
            if (errState)
              return;
            if (er2)
              return cb(errState = er2);
            if (--n === 0)
              options.rmdir(p, cb);
          });
        });
      });
    };
    var rimrafSync = (p, options) => {
      options = options || {};
      defaults(options);
      assert(p, "rimraf: missing path");
      assert.equal(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.equal(typeof options, "object", "rimraf: options should be object");
      let results;
      if (options.disableGlob || !glob.hasMagic(p)) {
        results = [p];
      } else {
        try {
          options.lstatSync(p);
          results = [p];
        } catch (er) {
          results = glob.sync(p, options.glob);
        }
      }
      if (!results.length)
        return;
      for (let i = 0; i < results.length; i++) {
        const p2 = results[i];
        let st;
        try {
          st = options.lstatSync(p2);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM" && isWindows)
            fixWinEPERMSync(p2, options, er);
        }
        try {
          if (st && st.isDirectory())
            rmdirSync(p2, options, null);
          else
            options.unlinkSync(p2);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM")
            return isWindows ? fixWinEPERMSync(p2, options, er) : rmdirSync(p2, options, er);
          if (er.code !== "EISDIR")
            throw er;
          rmdirSync(p2, options, er);
        }
      }
    };
    var rmdirSync = (p, options, originalEr) => {
      assert(p);
      assert(options);
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOENT")
          return;
        if (er.code === "ENOTDIR")
          throw originalEr;
        if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
          rmkidsSync(p, options);
      }
    };
    var rmkidsSync = (p, options) => {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach((f) => rimrafSync(path2.join(p, f), options));
      const retries = isWindows ? 100 : 1;
      let i = 0;
      do {
        let threw = true;
        try {
          const ret = options.rmdirSync(p, options);
          threw = false;
          return ret;
        } finally {
          if (++i < retries && threw)
            continue;
        }
      } while (true);
    };
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
  }
});

// node_modules/.pnpm/tmp@0.2.1/node_modules/tmp/lib/tmp.js
var require_tmp = __commonJS({
  "node_modules/.pnpm/tmp@0.2.1/node_modules/tmp/lib/tmp.js"(exports, module2) {
    var fs2 = require("fs");
    var os = require("os");
    var path2 = require("path");
    var crypto = require("crypto");
    var _c = { fs: fs2.constants, os: os.constants };
    var rimraf = require_rimraf2();
    var RANDOM_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var TEMPLATE_PATTERN = /XXXXXX/;
    var DEFAULT_TRIES = 3;
    var CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR);
    var IS_WIN32 = os.platform() === "win32";
    var EBADF = _c.EBADF || _c.os.errno.EBADF;
    var ENOENT = _c.ENOENT || _c.os.errno.ENOENT;
    var DIR_MODE = 448;
    var FILE_MODE = 384;
    var EXIT = "exit";
    var _removeObjects = [];
    var FN_RMDIR_SYNC = fs2.rmdirSync.bind(fs2);
    var FN_RIMRAF_SYNC = rimraf.sync;
    var _gracefulCleanup = false;
    function tmpName(options, callback) {
      const args = _parseArguments(options, callback), opts = args[0], cb = args[1];
      try {
        _assertAndSanitizeOptions(opts);
      } catch (err) {
        return cb(err);
      }
      let tries = opts.tries;
      (function _getUniqueName() {
        try {
          const name41 = _generateTmpName(opts);
          fs2.stat(name41, function(err) {
            if (!err) {
              if (tries-- > 0)
                return _getUniqueName();
              return cb(new Error("Could not get a unique tmp filename, max tries reached " + name41));
            }
            cb(null, name41);
          });
        } catch (err) {
          cb(err);
        }
      })();
    }
    function tmpNameSync(options) {
      const args = _parseArguments(options), opts = args[0];
      _assertAndSanitizeOptions(opts);
      let tries = opts.tries;
      do {
        const name41 = _generateTmpName(opts);
        try {
          fs2.statSync(name41);
        } catch (e) {
          return name41;
        }
      } while (tries-- > 0);
      throw new Error("Could not get a unique tmp filename, max tries reached");
    }
    function file(options, callback) {
      const args = _parseArguments(options, callback), opts = args[0], cb = args[1];
      tmpName(opts, function _tmpNameCreated(err, name41) {
        if (err)
          return cb(err);
        fs2.open(name41, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err2, fd) {
          if (err2)
            return cb(err2);
          if (opts.discardDescriptor) {
            return fs2.close(fd, function _discardCallback(possibleErr) {
              return cb(possibleErr, name41, void 0, _prepareTmpFileRemoveCallback(name41, -1, opts, false));
            });
          } else {
            const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
            cb(null, name41, fd, _prepareTmpFileRemoveCallback(name41, discardOrDetachDescriptor ? -1 : fd, opts, false));
          }
        });
      });
    }
    function fileSync(options) {
      const args = _parseArguments(options), opts = args[0];
      const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
      const name41 = tmpNameSync(opts);
      var fd = fs2.openSync(name41, CREATE_FLAGS, opts.mode || FILE_MODE);
      if (opts.discardDescriptor) {
        fs2.closeSync(fd);
        fd = void 0;
      }
      return {
        name: name41,
        fd,
        removeCallback: _prepareTmpFileRemoveCallback(name41, discardOrDetachDescriptor ? -1 : fd, opts, true)
      };
    }
    function dir(options, callback) {
      const args = _parseArguments(options, callback), opts = args[0], cb = args[1];
      tmpName(opts, function _tmpNameCreated(err, name41) {
        if (err)
          return cb(err);
        fs2.mkdir(name41, opts.mode || DIR_MODE, function _dirCreated(err2) {
          if (err2)
            return cb(err2);
          cb(null, name41, _prepareTmpDirRemoveCallback(name41, opts, false));
        });
      });
    }
    function dirSync(options) {
      const args = _parseArguments(options), opts = args[0];
      const name41 = tmpNameSync(opts);
      fs2.mkdirSync(name41, opts.mode || DIR_MODE);
      return {
        name: name41,
        removeCallback: _prepareTmpDirRemoveCallback(name41, opts, true)
      };
    }
    function _removeFileAsync(fdPath, next) {
      const _handler = function(err) {
        if (err && !_isENOENT(err)) {
          return next(err);
        }
        next();
      };
      if (0 <= fdPath[0])
        fs2.close(fdPath[0], function() {
          fs2.unlink(fdPath[1], _handler);
        });
      else
        fs2.unlink(fdPath[1], _handler);
    }
    function _removeFileSync(fdPath) {
      let rethrownException = null;
      try {
        if (0 <= fdPath[0])
          fs2.closeSync(fdPath[0]);
      } catch (e) {
        if (!_isEBADF(e) && !_isENOENT(e))
          throw e;
      } finally {
        try {
          fs2.unlinkSync(fdPath[1]);
        } catch (e) {
          if (!_isENOENT(e))
            rethrownException = e;
        }
      }
      if (rethrownException !== null) {
        throw rethrownException;
      }
    }
    function _prepareTmpFileRemoveCallback(name41, fd, opts, sync) {
      const removeCallbackSync = _prepareRemoveCallback(_removeFileSync, [fd, name41], sync);
      const removeCallback = _prepareRemoveCallback(_removeFileAsync, [fd, name41], sync, removeCallbackSync);
      if (!opts.keep)
        _removeObjects.unshift(removeCallbackSync);
      return sync ? removeCallbackSync : removeCallback;
    }
    function _prepareTmpDirRemoveCallback(name41, opts, sync) {
      const removeFunction = opts.unsafeCleanup ? rimraf : fs2.rmdir.bind(fs2);
      const removeFunctionSync = opts.unsafeCleanup ? FN_RIMRAF_SYNC : FN_RMDIR_SYNC;
      const removeCallbackSync = _prepareRemoveCallback(removeFunctionSync, name41, sync);
      const removeCallback = _prepareRemoveCallback(removeFunction, name41, sync, removeCallbackSync);
      if (!opts.keep)
        _removeObjects.unshift(removeCallbackSync);
      return sync ? removeCallbackSync : removeCallback;
    }
    function _prepareRemoveCallback(removeFunction, fileOrDirName, sync, cleanupCallbackSync) {
      let called = false;
      return function _cleanupCallback(next) {
        if (!called) {
          const toRemove = cleanupCallbackSync || _cleanupCallback;
          const index = _removeObjects.indexOf(toRemove);
          if (index >= 0)
            _removeObjects.splice(index, 1);
          called = true;
          if (sync || removeFunction === FN_RMDIR_SYNC || removeFunction === FN_RIMRAF_SYNC) {
            return removeFunction(fileOrDirName);
          } else {
            return removeFunction(fileOrDirName, next || function() {
            });
          }
        }
      };
    }
    function _garbageCollector() {
      if (!_gracefulCleanup)
        return;
      while (_removeObjects.length) {
        try {
          _removeObjects[0]();
        } catch (e) {
        }
      }
    }
    function _randomChars(howMany) {
      let value = [], rnd = null;
      try {
        rnd = crypto.randomBytes(howMany);
      } catch (e) {
        rnd = crypto.pseudoRandomBytes(howMany);
      }
      for (var i = 0; i < howMany; i++) {
        value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
      }
      return value.join("");
    }
    function _isBlank(s) {
      return s === null || _isUndefined(s) || !s.trim();
    }
    function _isUndefined(obj) {
      return typeof obj === "undefined";
    }
    function _parseArguments(options, callback) {
      if (typeof options === "function") {
        return [{}, options];
      }
      if (_isUndefined(options)) {
        return [{}, callback];
      }
      const actualOptions = {};
      for (const key of Object.getOwnPropertyNames(options)) {
        actualOptions[key] = options[key];
      }
      return [actualOptions, callback];
    }
    function _generateTmpName(opts) {
      const tmpDir = opts.tmpdir;
      if (!_isUndefined(opts.name))
        return path2.join(tmpDir, opts.dir, opts.name);
      if (!_isUndefined(opts.template))
        return path2.join(tmpDir, opts.dir, opts.template).replace(TEMPLATE_PATTERN, _randomChars(6));
      const name41 = [
        opts.prefix ? opts.prefix : "tmp",
        "-",
        process.pid,
        "-",
        _randomChars(12),
        opts.postfix ? "-" + opts.postfix : ""
      ].join("");
      return path2.join(tmpDir, opts.dir, name41);
    }
    function _assertAndSanitizeOptions(options) {
      options.tmpdir = _getTmpDir(options);
      const tmpDir = options.tmpdir;
      if (!_isUndefined(options.name))
        _assertIsRelative(options.name, "name", tmpDir);
      if (!_isUndefined(options.dir))
        _assertIsRelative(options.dir, "dir", tmpDir);
      if (!_isUndefined(options.template)) {
        _assertIsRelative(options.template, "template", tmpDir);
        if (!options.template.match(TEMPLATE_PATTERN))
          throw new Error(`Invalid template, found "${options.template}".`);
      }
      if (!_isUndefined(options.tries) && isNaN(options.tries) || options.tries < 0)
        throw new Error(`Invalid tries, found "${options.tries}".`);
      options.tries = _isUndefined(options.name) ? options.tries || DEFAULT_TRIES : 1;
      options.keep = !!options.keep;
      options.detachDescriptor = !!options.detachDescriptor;
      options.discardDescriptor = !!options.discardDescriptor;
      options.unsafeCleanup = !!options.unsafeCleanup;
      options.dir = _isUndefined(options.dir) ? "" : path2.relative(tmpDir, _resolvePath(options.dir, tmpDir));
      options.template = _isUndefined(options.template) ? void 0 : path2.relative(tmpDir, _resolvePath(options.template, tmpDir));
      options.template = _isBlank(options.template) ? void 0 : path2.relative(options.dir, options.template);
      options.name = _isUndefined(options.name) ? void 0 : _sanitizeName(options.name);
      options.prefix = _isUndefined(options.prefix) ? "" : options.prefix;
      options.postfix = _isUndefined(options.postfix) ? "" : options.postfix;
    }
    function _resolvePath(name41, tmpDir) {
      const sanitizedName = _sanitizeName(name41);
      if (sanitizedName.startsWith(tmpDir)) {
        return path2.resolve(sanitizedName);
      } else {
        return path2.resolve(path2.join(tmpDir, sanitizedName));
      }
    }
    function _sanitizeName(name41) {
      if (_isBlank(name41)) {
        return name41;
      }
      return name41.replace(/["']/g, "");
    }
    function _assertIsRelative(name41, option, tmpDir) {
      if (option === "name") {
        if (path2.isAbsolute(name41))
          throw new Error(`${option} option must not contain an absolute path, found "${name41}".`);
        let basename = path2.basename(name41);
        if (basename === ".." || basename === "." || basename !== name41)
          throw new Error(`${option} option must not contain a path, found "${name41}".`);
      } else {
        if (path2.isAbsolute(name41) && !name41.startsWith(tmpDir)) {
          throw new Error(`${option} option must be relative to "${tmpDir}", found "${name41}".`);
        }
        let resolvedPath = _resolvePath(name41, tmpDir);
        if (!resolvedPath.startsWith(tmpDir))
          throw new Error(`${option} option must be relative to "${tmpDir}", found "${resolvedPath}".`);
      }
    }
    function _isEBADF(error) {
      return _isExpectedError(error, -EBADF, "EBADF");
    }
    function _isENOENT(error) {
      return _isExpectedError(error, -ENOENT, "ENOENT");
    }
    function _isExpectedError(error, errno, code2) {
      return IS_WIN32 ? error.code === code2 : error.code === code2 && error.errno === errno;
    }
    function setGracefulCleanup() {
      _gracefulCleanup = true;
    }
    function _getTmpDir(options) {
      return path2.resolve(_sanitizeName(options && options.tmpdir || os.tmpdir()));
    }
    process.addListener(EXIT, _garbageCollector);
    Object.defineProperty(module2.exports, "tmpdir", {
      enumerable: true,
      configurable: false,
      get: function() {
        return _getTmpDir();
      }
    });
    module2.exports.dir = dir;
    module2.exports.dirSync = dirSync;
    module2.exports.file = file;
    module2.exports.fileSync = fileSync;
    module2.exports.tmpName = tmpName;
    module2.exports.tmpNameSync = tmpNameSync;
    module2.exports.setGracefulCleanup = setGracefulCleanup;
  }
});

// node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/base64.js"(exports) {
    var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    exports.encode = function(number2) {
      if (0 <= number2 && number2 < intToCharMap.length) {
        return intToCharMap[number2];
      }
      throw new TypeError("Must be between 0 and 63: " + number2);
    };
    exports.decode = function(charCode) {
      var bigA = 65;
      var bigZ = 90;
      var littleA = 97;
      var littleZ = 122;
      var zero2 = 48;
      var nine = 57;
      var plus = 43;
      var slash = 47;
      var littleOffset = 26;
      var numberOffset = 52;
      if (bigA <= charCode && charCode <= bigZ) {
        return charCode - bigA;
      }
      if (littleA <= charCode && charCode <= littleZ) {
        return charCode - littleA + littleOffset;
      }
      if (zero2 <= charCode && charCode <= nine) {
        return charCode - zero2 + numberOffset;
      }
      if (charCode == plus) {
        return 62;
      }
      if (charCode == slash) {
        return 63;
      }
      return -1;
    };
  }
});

// node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/base64-vlq.js
var require_base64_vlq = __commonJS({
  "node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/base64-vlq.js"(exports) {
    var base64 = require_base64();
    var VLQ_BASE_SHIFT = 5;
    var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
    var VLQ_BASE_MASK = VLQ_BASE - 1;
    var VLQ_CONTINUATION_BIT = VLQ_BASE;
    function toVLQSigned(aValue) {
      return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
    }
    function fromVLQSigned(aValue) {
      var isNegative = (aValue & 1) === 1;
      var shifted = aValue >> 1;
      return isNegative ? -shifted : shifted;
    }
    exports.encode = function base64VLQ_encode(aValue) {
      var encoded = "";
      var digit;
      var vlq = toVLQSigned(aValue);
      do {
        digit = vlq & VLQ_BASE_MASK;
        vlq >>>= VLQ_BASE_SHIFT;
        if (vlq > 0) {
          digit |= VLQ_CONTINUATION_BIT;
        }
        encoded += base64.encode(digit);
      } while (vlq > 0);
      return encoded;
    };
    exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
      var strLen = aStr.length;
      var result = 0;
      var shift = 0;
      var continuation, digit;
      do {
        if (aIndex >= strLen) {
          throw new Error("Expected more digits in base 64 VLQ value.");
        }
        digit = base64.decode(aStr.charCodeAt(aIndex++));
        if (digit === -1) {
          throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
        }
        continuation = !!(digit & VLQ_CONTINUATION_BIT);
        digit &= VLQ_BASE_MASK;
        result = result + (digit << shift);
        shift += VLQ_BASE_SHIFT;
      } while (continuation);
      aOutParam.value = fromVLQSigned(result);
      aOutParam.rest = aIndex;
    };
  }
});

// node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/util.js
var require_util = __commonJS({
  "node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/util.js"(exports) {
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      } else {
        throw new Error('"' + aName + '" is a required argument.');
      }
    }
    exports.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
      var match = aUrl.match(urlRegexp);
      if (!match) {
        return null;
      }
      return {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      };
    }
    exports.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
      var url = "";
      if (aParsedUrl.scheme) {
        url += aParsedUrl.scheme + ":";
      }
      url += "//";
      if (aParsedUrl.auth) {
        url += aParsedUrl.auth + "@";
      }
      if (aParsedUrl.host) {
        url += aParsedUrl.host;
      }
      if (aParsedUrl.port) {
        url += ":" + aParsedUrl.port;
      }
      if (aParsedUrl.path) {
        url += aParsedUrl.path;
      }
      return url;
    }
    exports.urlGenerate = urlGenerate;
    var MAX_CACHED_INPUTS = 32;
    function lruMemoize(f) {
      var cache = [];
      return function(input) {
        for (var i = 0; i < cache.length; i++) {
          if (cache[i].input === input) {
            var temp = cache[0];
            cache[0] = cache[i];
            cache[i] = temp;
            return cache[0].result;
          }
        }
        var result = f(input);
        cache.unshift({
          input,
          result
        });
        if (cache.length > MAX_CACHED_INPUTS) {
          cache.pop();
        }
        return result;
      };
    }
    var normalize = lruMemoize(function normalize2(aPath) {
      var path2 = aPath;
      var url = urlParse(aPath);
      if (url) {
        if (!url.path) {
          return aPath;
        }
        path2 = url.path;
      }
      var isAbsolute = exports.isAbsolute(path2);
      var parts = [];
      var start = 0;
      var i = 0;
      while (true) {
        start = i;
        i = path2.indexOf("/", start);
        if (i === -1) {
          parts.push(path2.slice(start));
          break;
        } else {
          parts.push(path2.slice(start, i));
          while (i < path2.length && path2[i] === "/") {
            i++;
          }
        }
      }
      for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
        part = parts[i];
        if (part === ".") {
          parts.splice(i, 1);
        } else if (part === "..") {
          up++;
        } else if (up > 0) {
          if (part === "") {
            parts.splice(i + 1, up);
            up = 0;
          } else {
            parts.splice(i, 2);
            up--;
          }
        }
      }
      path2 = parts.join("/");
      if (path2 === "") {
        path2 = isAbsolute ? "/" : ".";
      }
      if (url) {
        url.path = path2;
        return urlGenerate(url);
      }
      return path2;
    });
    exports.normalize = normalize;
    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      if (aPath === "") {
        aPath = ".";
      }
      var aPathUrl = urlParse(aPath);
      var aRootUrl = urlParse(aRoot);
      if (aRootUrl) {
        aRoot = aRootUrl.path || "/";
      }
      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }
        return urlGenerate(aPathUrl);
      }
      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      }
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }
      var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }
      return joined;
    }
    exports.join = join;
    exports.isAbsolute = function(aPath) {
      return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
    };
    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      aRoot = aRoot.replace(/\/$/, "");
      var level = 0;
      while (aPath.indexOf(aRoot + "/") !== 0) {
        var index = aRoot.lastIndexOf("/");
        if (index < 0) {
          return aPath;
        }
        aRoot = aRoot.slice(0, index);
        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }
        ++level;
      }
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports.relative = relative;
    var supportsNullProto = function() {
      var obj = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in obj);
    }();
    function identity(s) {
      return s;
    }
    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return "$" + aStr;
      }
      return aStr;
    }
    exports.toSetString = supportsNullProto ? identity : toSetString;
    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }
      return aStr;
    }
    exports.fromSetString = supportsNullProto ? identity : fromSetString;
    function isProtoString(s) {
      if (!s) {
        return false;
      }
      var length = s.length;
      if (length < 9) {
        return false;
      }
      if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
        return false;
      }
      for (var i = length - 10; i >= 0; i--) {
        if (s.charCodeAt(i) !== 36) {
          return false;
        }
      }
      return true;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositions = compareByOriginalPositions;
    function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
      var cmp;
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;
    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }
      if (aStr1 === null) {
        return 1;
      }
      if (aStr2 === null) {
        return -1;
      }
      if (aStr1 > aStr2) {
        return 1;
      }
      return -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
    }
    exports.parseSourceMapInput = parseSourceMapInput;
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      sourceURL = sourceURL || "";
      if (sourceRoot) {
        if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
          sourceRoot += "/";
        }
        sourceURL = sourceRoot + sourceURL;
      }
      if (sourceMapURL) {
        var parsed = urlParse(sourceMapURL);
        if (!parsed) {
          throw new Error("sourceMapURL could not be parsed");
        }
        if (parsed.path) {
          var index = parsed.path.lastIndexOf("/");
          if (index >= 0) {
            parsed.path = parsed.path.substring(0, index + 1);
          }
        }
        sourceURL = join(urlGenerate(parsed), sourceURL);
      }
      return normalize(sourceURL);
    }
    exports.computeSourceURL = computeSourceURL;
  }
});

// node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/array-set.js
var require_array_set = __commonJS({
  "node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/array-set.js"(exports) {
    var util2 = require_util();
    var has = Object.prototype.hasOwnProperty;
    var hasNativeMap = typeof Map !== "undefined";
    function ArraySet() {
      this._array = [];
      this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
    }
    ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
      var set = new ArraySet();
      for (var i = 0, len = aArray.length; i < len; i++) {
        set.add(aArray[i], aAllowDuplicates);
      }
      return set;
    };
    ArraySet.prototype.size = function ArraySet_size() {
      return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
    };
    ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
      var sStr = hasNativeMap ? aStr : util2.toSetString(aStr);
      var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
      var idx = this._array.length;
      if (!isDuplicate || aAllowDuplicates) {
        this._array.push(aStr);
      }
      if (!isDuplicate) {
        if (hasNativeMap) {
          this._set.set(aStr, idx);
        } else {
          this._set[sStr] = idx;
        }
      }
    };
    ArraySet.prototype.has = function ArraySet_has(aStr) {
      if (hasNativeMap) {
        return this._set.has(aStr);
      } else {
        var sStr = util2.toSetString(aStr);
        return has.call(this._set, sStr);
      }
    };
    ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
      if (hasNativeMap) {
        var idx = this._set.get(aStr);
        if (idx >= 0) {
          return idx;
        }
      } else {
        var sStr = util2.toSetString(aStr);
        if (has.call(this._set, sStr)) {
          return this._set[sStr];
        }
      }
      throw new Error('"' + aStr + '" is not in the set.');
    };
    ArraySet.prototype.at = function ArraySet_at(aIdx) {
      if (aIdx >= 0 && aIdx < this._array.length) {
        return this._array[aIdx];
      }
      throw new Error("No element indexed by " + aIdx);
    };
    ArraySet.prototype.toArray = function ArraySet_toArray() {
      return this._array.slice();
    };
    exports.ArraySet = ArraySet;
  }
});

// node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/mapping-list.js
var require_mapping_list = __commonJS({
  "node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/mapping-list.js"(exports) {
    var util2 = require_util();
    function generatedPositionAfter(mappingA, mappingB) {
      var lineA = mappingA.generatedLine;
      var lineB = mappingB.generatedLine;
      var columnA = mappingA.generatedColumn;
      var columnB = mappingB.generatedColumn;
      return lineB > lineA || lineB == lineA && columnB >= columnA || util2.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
    }
    function MappingList() {
      this._array = [];
      this._sorted = true;
      this._last = { generatedLine: -1, generatedColumn: 0 };
    }
    MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
      this._array.forEach(aCallback, aThisArg);
    };
    MappingList.prototype.add = function MappingList_add(aMapping) {
      if (generatedPositionAfter(this._last, aMapping)) {
        this._last = aMapping;
        this._array.push(aMapping);
      } else {
        this._sorted = false;
        this._array.push(aMapping);
      }
    };
    MappingList.prototype.toArray = function MappingList_toArray() {
      if (!this._sorted) {
        this._array.sort(util2.compareByGeneratedPositionsInflated);
        this._sorted = true;
      }
      return this._array;
    };
    exports.MappingList = MappingList;
  }
});

// node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/source-map-generator.js
var require_source_map_generator = __commonJS({
  "node_modules/.pnpm/source-map-js@1.0.2/node_modules/source-map-js/lib/source-map-generator.js"(exports) {
    var base64VLQ = require_base64_vlq();
    var util2 = require_util();
    var ArraySet = require_array_set().ArraySet;
    var MappingList = require_mapping_list().MappingList;
    function SourceMapGenerator2(aArgs) {
      if (!aArgs) {
        aArgs = {};
      }
      this._file = util2.getArg(aArgs, "file", null);
      this._sourceRoot = util2.getArg(aArgs, "sourceRoot", null);
      this._skipValidation = util2.getArg(aArgs, "skipValidation", false);
      this._sources = new ArraySet();
      this._names = new ArraySet();
      this._mappings = new MappingList();
      this._sourcesContents = null;
    }
    SourceMapGenerator2.prototype._version = 3;
    SourceMapGenerator2.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator2({
        file: aSourceMapConsumer.file,
        sourceRoot
      });
      aSourceMapConsumer.eachMapping(function(mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };
        if (mapping.source != null) {
          newMapping.source = mapping.source;
          if (sourceRoot != null) {
            newMapping.source = util2.relative(sourceRoot, newMapping.source);
          }
          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };
          if (mapping.name != null) {
            newMapping.name = mapping.name;
          }
        }
        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function(sourceFile) {
        var sourceRelative = sourceFile;
        if (sourceRoot !== null) {
          sourceRelative = util2.relative(sourceRoot, sourceFile);
        }
        if (!generator._sources.has(sourceRelative)) {
          generator._sources.add(sourceRelative);
        }
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };
    SourceMapGenerator2.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
      var generated = util2.getArg(aArgs, "generated");
      var original = util2.getArg(aArgs, "original", null);
      var source = util2.getArg(aArgs, "source", null);
      var name41 = util2.getArg(aArgs, "name", null);
      if (!this._skipValidation) {
        this._validateMapping(generated, original, source, name41);
      }
      if (source != null) {
        source = String(source);
        if (!this._sources.has(source)) {
          this._sources.add(source);
        }
      }
      if (name41 != null) {
        name41 = String(name41);
        if (!this._names.has(name41)) {
          this._names.add(name41);
        }
      }
      this._mappings.add({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source,
        name: name41
      });
    };
    SourceMapGenerator2.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot != null) {
        source = util2.relative(this._sourceRoot, source);
      }
      if (aSourceContent != null) {
        if (!this._sourcesContents) {
          this._sourcesContents = /* @__PURE__ */ Object.create(null);
        }
        this._sourcesContents[util2.toSetString(source)] = aSourceContent;
      } else if (this._sourcesContents) {
        delete this._sourcesContents[util2.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };
    SourceMapGenerator2.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null) {
          throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
        }
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      if (sourceRoot != null) {
        sourceFile = util2.relative(sourceRoot, sourceFile);
      }
      var newSources = new ArraySet();
      var newNames = new ArraySet();
      this._mappings.unsortedForEach(function(mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source != null) {
            mapping.source = original.source;
            if (aSourceMapPath != null) {
              mapping.source = util2.join(aSourceMapPath, mapping.source);
            }
            if (sourceRoot != null) {
              mapping.source = util2.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name != null) {
              mapping.name = original.name;
            }
          }
        }
        var source = mapping.source;
        if (source != null && !newSources.has(source)) {
          newSources.add(source);
        }
        var name41 = mapping.name;
        if (name41 != null && !newNames.has(name41)) {
          newNames.add(name41);
        }
      }, this);
      this._sources = newSources;
      this._names = newNames;
      aSourceMapConsumer.sources.forEach(function(sourceFile2) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
        if (content != null) {
          if (aSourceMapPath != null) {
            sourceFile2 = util2.join(aSourceMapPath, sourceFile2);
          }
          if (sourceRoot != null) {
            sourceFile2 = util2.relative(sourceRoot, sourceFile2);
          }
          this.setSourceContent(sourceFile2, content);
        }
      }, this);
    };
    SourceMapGenerator2.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
      if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
        throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
      }
      if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
        return;
      } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
        return;
      } else {
        throw new Error("Invalid mapping: " + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };
    SourceMapGenerator2.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = "";
      var next;
      var mapping;
      var nameIdx;
      var sourceIdx;
      var mappings = this._mappings.toArray();
      for (var i = 0, len = mappings.length; i < len; i++) {
        mapping = mappings[i];
        next = "";
        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            next += ";";
            previousGeneratedLine++;
          }
        } else {
          if (i > 0) {
            if (!util2.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
              continue;
            }
            next += ",";
          }
        }
        next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;
        if (mapping.source != null) {
          sourceIdx = this._sources.indexOf(mapping.source);
          next += base64VLQ.encode(sourceIdx - previousSource);
          previousSource = sourceIdx;
          next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;
          next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;
          if (mapping.name != null) {
            nameIdx = this._names.indexOf(mapping.name);
            next += base64VLQ.encode(nameIdx - previousName);
            previousName = nameIdx;
          }
        }
        result += next;
      }
      return result;
    };
    SourceMapGenerator2.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function(source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot != null) {
          source = util2.relative(aSourceRoot, source);
        }
        var key = util2.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
      }, this);
    };
    SourceMapGenerator2.prototype.toJSON = function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._file != null) {
        map.file = this._file;
      }
      if (this._sourceRoot != null) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }
      return map;
    };
    SourceMapGenerator2.prototype.toString = function SourceMapGenerator_toString() {
      return JSON.stringify(this.toJSON());
    };
    exports.SourceMapGenerator = SourceMapGenerator2;
  }
});

// plugins/cssModulePlugin.ts
var cssModulePlugin_exports = {};
__export(cssModulePlugin_exports, {
  default: () => cssModulePlugin_default
});
module.exports = __toCommonJS(cssModulePlugin_exports);
var import_fs_extra = __toESM(require_lib());
var import_util = __toESM(require("util"));
var import_tmp = __toESM(require_tmp());
var import_path = __toESM(require("path"));

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/tokenizer/types.js
var EOF = 0;
var Ident = 1;
var Function2 = 2;
var AtKeyword = 3;
var Hash = 4;
var String2 = 5;
var BadString = 6;
var Url = 7;
var BadUrl = 8;
var Delim = 9;
var Number2 = 10;
var Percentage = 11;
var Dimension = 12;
var WhiteSpace = 13;
var CDO = 14;
var CDC = 15;
var Colon = 16;
var Semicolon = 17;
var Comma = 18;
var LeftSquareBracket = 19;
var RightSquareBracket = 20;
var LeftParenthesis = 21;
var RightParenthesis = 22;
var LeftCurlyBracket = 23;
var RightCurlyBracket = 24;
var Comment = 25;

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/tokenizer/char-code-definitions.js
var EOF2 = 0;
function isDigit(code2) {
  return code2 >= 48 && code2 <= 57;
}
function isHexDigit(code2) {
  return isDigit(code2) || code2 >= 65 && code2 <= 70 || code2 >= 97 && code2 <= 102;
}
function isUppercaseLetter(code2) {
  return code2 >= 65 && code2 <= 90;
}
function isLowercaseLetter(code2) {
  return code2 >= 97 && code2 <= 122;
}
function isLetter(code2) {
  return isUppercaseLetter(code2) || isLowercaseLetter(code2);
}
function isNonAscii(code2) {
  return code2 >= 128;
}
function isNameStart(code2) {
  return isLetter(code2) || isNonAscii(code2) || code2 === 95;
}
function isName(code2) {
  return isNameStart(code2) || isDigit(code2) || code2 === 45;
}
function isNonPrintable(code2) {
  return code2 >= 0 && code2 <= 8 || code2 === 11 || code2 >= 14 && code2 <= 31 || code2 === 127;
}
function isNewline(code2) {
  return code2 === 10 || code2 === 13 || code2 === 12;
}
function isWhiteSpace(code2) {
  return isNewline(code2) || code2 === 32 || code2 === 9;
}
function isValidEscape(first, second) {
  if (first !== 92) {
    return false;
  }
  if (isNewline(second) || second === EOF2) {
    return false;
  }
  return true;
}
function isIdentifierStart(first, second, third) {
  if (first === 45) {
    return isNameStart(second) || second === 45 || isValidEscape(second, third);
  }
  if (isNameStart(first)) {
    return true;
  }
  if (first === 92) {
    return isValidEscape(first, second);
  }
  return false;
}
function isNumberStart(first, second, third) {
  if (first === 43 || first === 45) {
    if (isDigit(second)) {
      return 2;
    }
    return second === 46 && isDigit(third) ? 3 : 0;
  }
  if (first === 46) {
    return isDigit(second) ? 2 : 0;
  }
  if (isDigit(first)) {
    return 1;
  }
  return 0;
}
function isBOM(code2) {
  if (code2 === 65279) {
    return 1;
  }
  if (code2 === 65534) {
    return 1;
  }
  return 0;
}
var CATEGORY = new Array(128);
var EofCategory = 128;
var WhiteSpaceCategory = 130;
var DigitCategory = 131;
var NameStartCategory = 132;
var NonPrintableCategory = 133;
for (let i = 0; i < CATEGORY.length; i++) {
  CATEGORY[i] = isWhiteSpace(i) && WhiteSpaceCategory || isDigit(i) && DigitCategory || isNameStart(i) && NameStartCategory || isNonPrintable(i) && NonPrintableCategory || i || EofCategory;
}
function charCodeCategory(code2) {
  return code2 < 128 ? CATEGORY[code2] : NameStartCategory;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/tokenizer/utils.js
function getCharCode(source, offset) {
  return offset < source.length ? source.charCodeAt(offset) : 0;
}
function getNewlineLength(source, offset, code2) {
  if (code2 === 13 && getCharCode(source, offset + 1) === 10) {
    return 2;
  }
  return 1;
}
function cmpChar(testStr, offset, referenceCode) {
  let code2 = testStr.charCodeAt(offset);
  if (isUppercaseLetter(code2)) {
    code2 = code2 | 32;
  }
  return code2 === referenceCode;
}
function cmpStr(testStr, start, end, referenceStr) {
  if (end - start !== referenceStr.length) {
    return false;
  }
  if (start < 0 || end > testStr.length) {
    return false;
  }
  for (let i = start; i < end; i++) {
    const referenceCode = referenceStr.charCodeAt(i - start);
    let testCode = testStr.charCodeAt(i);
    if (isUppercaseLetter(testCode)) {
      testCode = testCode | 32;
    }
    if (testCode !== referenceCode) {
      return false;
    }
  }
  return true;
}
function findWhiteSpaceStart(source, offset) {
  for (; offset >= 0; offset--) {
    if (!isWhiteSpace(source.charCodeAt(offset))) {
      break;
    }
  }
  return offset + 1;
}
function findWhiteSpaceEnd(source, offset) {
  for (; offset < source.length; offset++) {
    if (!isWhiteSpace(source.charCodeAt(offset))) {
      break;
    }
  }
  return offset;
}
function findDecimalNumberEnd(source, offset) {
  for (; offset < source.length; offset++) {
    if (!isDigit(source.charCodeAt(offset))) {
      break;
    }
  }
  return offset;
}
function consumeEscaped(source, offset) {
  offset += 2;
  if (isHexDigit(getCharCode(source, offset - 1))) {
    for (const maxOffset = Math.min(source.length, offset + 5); offset < maxOffset; offset++) {
      if (!isHexDigit(getCharCode(source, offset))) {
        break;
      }
    }
    const code2 = getCharCode(source, offset);
    if (isWhiteSpace(code2)) {
      offset += getNewlineLength(source, offset, code2);
    }
  }
  return offset;
}
function consumeName(source, offset) {
  for (; offset < source.length; offset++) {
    const code2 = source.charCodeAt(offset);
    if (isName(code2)) {
      continue;
    }
    if (isValidEscape(code2, getCharCode(source, offset + 1))) {
      offset = consumeEscaped(source, offset) - 1;
      continue;
    }
    break;
  }
  return offset;
}
function consumeNumber(source, offset) {
  let code2 = source.charCodeAt(offset);
  if (code2 === 43 || code2 === 45) {
    code2 = source.charCodeAt(offset += 1);
  }
  if (isDigit(code2)) {
    offset = findDecimalNumberEnd(source, offset + 1);
    code2 = source.charCodeAt(offset);
  }
  if (code2 === 46 && isDigit(source.charCodeAt(offset + 1))) {
    offset += 2;
    offset = findDecimalNumberEnd(source, offset);
  }
  if (cmpChar(source, offset, 101)) {
    let sign = 0;
    code2 = source.charCodeAt(offset + 1);
    if (code2 === 45 || code2 === 43) {
      sign = 1;
      code2 = source.charCodeAt(offset + 2);
    }
    if (isDigit(code2)) {
      offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
    }
  }
  return offset;
}
function consumeBadUrlRemnants(source, offset) {
  for (; offset < source.length; offset++) {
    const code2 = source.charCodeAt(offset);
    if (code2 === 41) {
      offset++;
      break;
    }
    if (isValidEscape(code2, getCharCode(source, offset + 1))) {
      offset = consumeEscaped(source, offset);
    }
  }
  return offset;
}
function decodeEscaped(escaped) {
  if (escaped.length === 1 && !isHexDigit(escaped.charCodeAt(0))) {
    return escaped[0];
  }
  let code2 = parseInt(escaped, 16);
  if (code2 === 0 || code2 >= 55296 && code2 <= 57343 || code2 > 1114111) {
    code2 = 65533;
  }
  return String.fromCodePoint(code2);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/tokenizer/names.js
var names_default = [
  "EOF-token",
  "ident-token",
  "function-token",
  "at-keyword-token",
  "hash-token",
  "string-token",
  "bad-string-token",
  "url-token",
  "bad-url-token",
  "delim-token",
  "number-token",
  "percentage-token",
  "dimension-token",
  "whitespace-token",
  "CDO-token",
  "CDC-token",
  "colon-token",
  "semicolon-token",
  "comma-token",
  "[-token",
  "]-token",
  "(-token",
  ")-token",
  "{-token",
  "}-token"
];

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/tokenizer/adopt-buffer.js
var MIN_SIZE = 16 * 1024;
function adoptBuffer(buffer = null, size) {
  if (buffer === null || buffer.length < size) {
    return new Uint32Array(Math.max(size + 1024, MIN_SIZE));
  }
  return buffer;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/tokenizer/OffsetToLocation.js
var N = 10;
var F = 12;
var R = 13;
function computeLinesAndColumns(host) {
  const source = host.source;
  const sourceLength = source.length;
  const startOffset = source.length > 0 ? isBOM(source.charCodeAt(0)) : 0;
  const lines = adoptBuffer(host.lines, sourceLength);
  const columns = adoptBuffer(host.columns, sourceLength);
  let line = host.startLine;
  let column = host.startColumn;
  for (let i = startOffset; i < sourceLength; i++) {
    const code2 = source.charCodeAt(i);
    lines[i] = line;
    columns[i] = column++;
    if (code2 === N || code2 === R || code2 === F) {
      if (code2 === R && i + 1 < sourceLength && source.charCodeAt(i + 1) === N) {
        i++;
        lines[i] = line;
        columns[i] = column;
      }
      line++;
      column = 1;
    }
  }
  lines[sourceLength] = line;
  columns[sourceLength] = column;
  host.lines = lines;
  host.columns = columns;
  host.computed = true;
}
var OffsetToLocation = class {
  constructor() {
    this.lines = null;
    this.columns = null;
    this.computed = false;
  }
  setSource(source, startOffset = 0, startLine = 1, startColumn = 1) {
    this.source = source;
    this.startOffset = startOffset;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.computed = false;
  }
  getLocation(offset, filename) {
    if (!this.computed) {
      computeLinesAndColumns(this);
    }
    return {
      source: filename,
      offset: this.startOffset + offset,
      line: this.lines[offset],
      column: this.columns[offset]
    };
  }
  getLocationRange(start, end, filename) {
    if (!this.computed) {
      computeLinesAndColumns(this);
    }
    return {
      source: filename,
      start: {
        offset: this.startOffset + start,
        line: this.lines[start],
        column: this.columns[start]
      },
      end: {
        offset: this.startOffset + end,
        line: this.lines[end],
        column: this.columns[end]
      }
    };
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/tokenizer/TokenStream.js
var OFFSET_MASK = 16777215;
var TYPE_SHIFT = 24;
var balancePair = /* @__PURE__ */ new Map([
  [Function2, RightParenthesis],
  [LeftParenthesis, RightParenthesis],
  [LeftSquareBracket, RightSquareBracket],
  [LeftCurlyBracket, RightCurlyBracket]
]);
var TokenStream = class {
  constructor(source, tokenize3) {
    this.setSource(source, tokenize3);
  }
  reset() {
    this.eof = false;
    this.tokenIndex = -1;
    this.tokenType = 0;
    this.tokenStart = this.firstCharOffset;
    this.tokenEnd = this.firstCharOffset;
  }
  setSource(source = "", tokenize3 = () => {
  }) {
    source = String(source || "");
    const sourceLength = source.length;
    const offsetAndType = adoptBuffer(this.offsetAndType, source.length + 1);
    const balance = adoptBuffer(this.balance, source.length + 1);
    let tokenCount = 0;
    let balanceCloseType = 0;
    let balanceStart = 0;
    let firstCharOffset = -1;
    this.offsetAndType = null;
    this.balance = null;
    tokenize3(source, (type, start, end) => {
      switch (type) {
        default:
          balance[tokenCount] = sourceLength;
          break;
        case balanceCloseType: {
          let balancePrev = balanceStart & OFFSET_MASK;
          balanceStart = balance[balancePrev];
          balanceCloseType = balanceStart >> TYPE_SHIFT;
          balance[tokenCount] = balancePrev;
          balance[balancePrev++] = tokenCount;
          for (; balancePrev < tokenCount; balancePrev++) {
            if (balance[balancePrev] === sourceLength) {
              balance[balancePrev] = tokenCount;
            }
          }
          break;
        }
        case LeftParenthesis:
        case Function2:
        case LeftSquareBracket:
        case LeftCurlyBracket:
          balance[tokenCount] = balanceStart;
          balanceCloseType = balancePair.get(type);
          balanceStart = balanceCloseType << TYPE_SHIFT | tokenCount;
          break;
      }
      offsetAndType[tokenCount++] = type << TYPE_SHIFT | end;
      if (firstCharOffset === -1) {
        firstCharOffset = start;
      }
    });
    offsetAndType[tokenCount] = EOF << TYPE_SHIFT | sourceLength;
    balance[tokenCount] = sourceLength;
    balance[sourceLength] = sourceLength;
    while (balanceStart !== 0) {
      const balancePrev = balanceStart & OFFSET_MASK;
      balanceStart = balance[balancePrev];
      balance[balancePrev] = sourceLength;
    }
    this.source = source;
    this.firstCharOffset = firstCharOffset === -1 ? 0 : firstCharOffset;
    this.tokenCount = tokenCount;
    this.offsetAndType = offsetAndType;
    this.balance = balance;
    this.reset();
    this.next();
  }
  lookupType(offset) {
    offset += this.tokenIndex;
    if (offset < this.tokenCount) {
      return this.offsetAndType[offset] >> TYPE_SHIFT;
    }
    return EOF;
  }
  lookupOffset(offset) {
    offset += this.tokenIndex;
    if (offset < this.tokenCount) {
      return this.offsetAndType[offset - 1] & OFFSET_MASK;
    }
    return this.source.length;
  }
  lookupValue(offset, referenceStr) {
    offset += this.tokenIndex;
    if (offset < this.tokenCount) {
      return cmpStr(this.source, this.offsetAndType[offset - 1] & OFFSET_MASK, this.offsetAndType[offset] & OFFSET_MASK, referenceStr);
    }
    return false;
  }
  getTokenStart(tokenIndex) {
    if (tokenIndex === this.tokenIndex) {
      return this.tokenStart;
    }
    if (tokenIndex > 0) {
      return tokenIndex < this.tokenCount ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
    }
    return this.firstCharOffset;
  }
  substrToCursor(start) {
    return this.source.substring(start, this.tokenStart);
  }
  isBalanceEdge(pos) {
    return this.balance[this.tokenIndex] < pos;
  }
  isDelim(code2, offset) {
    if (offset) {
      return this.lookupType(offset) === Delim && this.source.charCodeAt(this.lookupOffset(offset)) === code2;
    }
    return this.tokenType === Delim && this.source.charCodeAt(this.tokenStart) === code2;
  }
  skip(tokenCount) {
    let next = this.tokenIndex + tokenCount;
    if (next < this.tokenCount) {
      this.tokenIndex = next;
      this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
      next = this.offsetAndType[next];
      this.tokenType = next >> TYPE_SHIFT;
      this.tokenEnd = next & OFFSET_MASK;
    } else {
      this.tokenIndex = this.tokenCount;
      this.next();
    }
  }
  next() {
    let next = this.tokenIndex + 1;
    if (next < this.tokenCount) {
      this.tokenIndex = next;
      this.tokenStart = this.tokenEnd;
      next = this.offsetAndType[next];
      this.tokenType = next >> TYPE_SHIFT;
      this.tokenEnd = next & OFFSET_MASK;
    } else {
      this.eof = true;
      this.tokenIndex = this.tokenCount;
      this.tokenType = EOF;
      this.tokenStart = this.tokenEnd = this.source.length;
    }
  }
  skipSC() {
    while (this.tokenType === WhiteSpace || this.tokenType === Comment) {
      this.next();
    }
  }
  skipUntilBalanced(startToken, stopConsume) {
    let cursor = startToken;
    let balanceEnd;
    let offset;
    loop:
      for (; cursor < this.tokenCount; cursor++) {
        balanceEnd = this.balance[cursor];
        if (balanceEnd < startToken) {
          break loop;
        }
        offset = cursor > 0 ? this.offsetAndType[cursor - 1] & OFFSET_MASK : this.firstCharOffset;
        switch (stopConsume(this.source.charCodeAt(offset))) {
          case 1:
            break loop;
          case 2:
            cursor++;
            break loop;
          default:
            if (this.balance[balanceEnd] === cursor) {
              cursor = balanceEnd;
            }
        }
      }
    this.skip(cursor - this.tokenIndex);
  }
  forEachToken(fn) {
    for (let i = 0, offset = this.firstCharOffset; i < this.tokenCount; i++) {
      const start = offset;
      const item = this.offsetAndType[i];
      const end = item & OFFSET_MASK;
      const type = item >> TYPE_SHIFT;
      offset = end;
      fn(type, start, end, i);
    }
  }
  dump() {
    const tokens = new Array(this.tokenCount);
    this.forEachToken((type, start, end, index) => {
      tokens[index] = {
        idx: index,
        type: names_default[type],
        chunk: this.source.substring(start, end),
        balance: this.balance[index]
      };
    });
    return tokens;
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/tokenizer/index.js
function tokenize(source, onToken) {
  function getCharCode2(offset2) {
    return offset2 < sourceLength ? source.charCodeAt(offset2) : 0;
  }
  function consumeNumericToken() {
    offset = consumeNumber(source, offset);
    if (isIdentifierStart(getCharCode2(offset), getCharCode2(offset + 1), getCharCode2(offset + 2))) {
      type = Dimension;
      offset = consumeName(source, offset);
      return;
    }
    if (getCharCode2(offset) === 37) {
      type = Percentage;
      offset++;
      return;
    }
    type = Number2;
  }
  function consumeIdentLikeToken() {
    const nameStartOffset = offset;
    offset = consumeName(source, offset);
    if (cmpStr(source, nameStartOffset, offset, "url") && getCharCode2(offset) === 40) {
      offset = findWhiteSpaceEnd(source, offset + 1);
      if (getCharCode2(offset) === 34 || getCharCode2(offset) === 39) {
        type = Function2;
        offset = nameStartOffset + 4;
        return;
      }
      consumeUrlToken();
      return;
    }
    if (getCharCode2(offset) === 40) {
      type = Function2;
      offset++;
      return;
    }
    type = Ident;
  }
  function consumeStringToken(endingCodePoint) {
    if (!endingCodePoint) {
      endingCodePoint = getCharCode2(offset++);
    }
    type = String2;
    for (; offset < source.length; offset++) {
      const code2 = source.charCodeAt(offset);
      switch (charCodeCategory(code2)) {
        case endingCodePoint:
          offset++;
          return;
        case WhiteSpaceCategory:
          if (isNewline(code2)) {
            offset += getNewlineLength(source, offset, code2);
            type = BadString;
            return;
          }
          break;
        case 92:
          if (offset === source.length - 1) {
            break;
          }
          const nextCode = getCharCode2(offset + 1);
          if (isNewline(nextCode)) {
            offset += getNewlineLength(source, offset + 1, nextCode);
          } else if (isValidEscape(code2, nextCode)) {
            offset = consumeEscaped(source, offset) - 1;
          }
          break;
      }
    }
  }
  function consumeUrlToken() {
    type = Url;
    offset = findWhiteSpaceEnd(source, offset);
    for (; offset < source.length; offset++) {
      const code2 = source.charCodeAt(offset);
      switch (charCodeCategory(code2)) {
        case 41:
          offset++;
          return;
        case WhiteSpaceCategory:
          offset = findWhiteSpaceEnd(source, offset);
          if (getCharCode2(offset) === 41 || offset >= source.length) {
            if (offset < source.length) {
              offset++;
            }
            return;
          }
          offset = consumeBadUrlRemnants(source, offset);
          type = BadUrl;
          return;
        case 34:
        case 39:
        case 40:
        case NonPrintableCategory:
          offset = consumeBadUrlRemnants(source, offset);
          type = BadUrl;
          return;
        case 92:
          if (isValidEscape(code2, getCharCode2(offset + 1))) {
            offset = consumeEscaped(source, offset) - 1;
            break;
          }
          offset = consumeBadUrlRemnants(source, offset);
          type = BadUrl;
          return;
      }
    }
  }
  source = String(source || "");
  const sourceLength = source.length;
  let start = isBOM(getCharCode2(0));
  let offset = start;
  let type;
  while (offset < sourceLength) {
    const code2 = source.charCodeAt(offset);
    switch (charCodeCategory(code2)) {
      case WhiteSpaceCategory:
        type = WhiteSpace;
        offset = findWhiteSpaceEnd(source, offset + 1);
        break;
      case 34:
        consumeStringToken();
        break;
      case 35:
        if (isName(getCharCode2(offset + 1)) || isValidEscape(getCharCode2(offset + 1), getCharCode2(offset + 2))) {
          type = Hash;
          offset = consumeName(source, offset + 1);
        } else {
          type = Delim;
          offset++;
        }
        break;
      case 39:
        consumeStringToken();
        break;
      case 40:
        type = LeftParenthesis;
        offset++;
        break;
      case 41:
        type = RightParenthesis;
        offset++;
        break;
      case 43:
        if (isNumberStart(code2, getCharCode2(offset + 1), getCharCode2(offset + 2))) {
          consumeNumericToken();
        } else {
          type = Delim;
          offset++;
        }
        break;
      case 44:
        type = Comma;
        offset++;
        break;
      case 45:
        if (isNumberStart(code2, getCharCode2(offset + 1), getCharCode2(offset + 2))) {
          consumeNumericToken();
        } else {
          if (getCharCode2(offset + 1) === 45 && getCharCode2(offset + 2) === 62) {
            type = CDC;
            offset = offset + 3;
          } else {
            if (isIdentifierStart(code2, getCharCode2(offset + 1), getCharCode2(offset + 2))) {
              consumeIdentLikeToken();
            } else {
              type = Delim;
              offset++;
            }
          }
        }
        break;
      case 46:
        if (isNumberStart(code2, getCharCode2(offset + 1), getCharCode2(offset + 2))) {
          consumeNumericToken();
        } else {
          type = Delim;
          offset++;
        }
        break;
      case 47:
        if (getCharCode2(offset + 1) === 42) {
          type = Comment;
          offset = source.indexOf("*/", offset + 2);
          offset = offset === -1 ? source.length : offset + 2;
        } else {
          type = Delim;
          offset++;
        }
        break;
      case 58:
        type = Colon;
        offset++;
        break;
      case 59:
        type = Semicolon;
        offset++;
        break;
      case 60:
        if (getCharCode2(offset + 1) === 33 && getCharCode2(offset + 2) === 45 && getCharCode2(offset + 3) === 45) {
          type = CDO;
          offset = offset + 4;
        } else {
          type = Delim;
          offset++;
        }
        break;
      case 64:
        if (isIdentifierStart(getCharCode2(offset + 1), getCharCode2(offset + 2), getCharCode2(offset + 3))) {
          type = AtKeyword;
          offset = consumeName(source, offset + 1);
        } else {
          type = Delim;
          offset++;
        }
        break;
      case 91:
        type = LeftSquareBracket;
        offset++;
        break;
      case 92:
        if (isValidEscape(code2, getCharCode2(offset + 1))) {
          consumeIdentLikeToken();
        } else {
          type = Delim;
          offset++;
        }
        break;
      case 93:
        type = RightSquareBracket;
        offset++;
        break;
      case 123:
        type = LeftCurlyBracket;
        offset++;
        break;
      case 125:
        type = RightCurlyBracket;
        offset++;
        break;
      case DigitCategory:
        consumeNumericToken();
        break;
      case NameStartCategory:
        consumeIdentLikeToken();
        break;
      default:
        type = Delim;
        offset++;
    }
    onToken(type, start, start = offset);
  }
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/utils/List.js
var releasedCursors = null;
var List = class {
  static createItem(data) {
    return {
      prev: null,
      next: null,
      data
    };
  }
  constructor() {
    this.head = null;
    this.tail = null;
    this.cursor = null;
  }
  createItem(data) {
    return List.createItem(data);
  }
  allocateCursor(prev, next) {
    let cursor;
    if (releasedCursors !== null) {
      cursor = releasedCursors;
      releasedCursors = releasedCursors.cursor;
      cursor.prev = prev;
      cursor.next = next;
      cursor.cursor = this.cursor;
    } else {
      cursor = {
        prev,
        next,
        cursor: this.cursor
      };
    }
    this.cursor = cursor;
    return cursor;
  }
  releaseCursor() {
    const { cursor } = this;
    this.cursor = cursor.cursor;
    cursor.prev = null;
    cursor.next = null;
    cursor.cursor = releasedCursors;
    releasedCursors = cursor;
  }
  updateCursors(prevOld, prevNew, nextOld, nextNew) {
    let { cursor } = this;
    while (cursor !== null) {
      if (cursor.prev === prevOld) {
        cursor.prev = prevNew;
      }
      if (cursor.next === nextOld) {
        cursor.next = nextNew;
      }
      cursor = cursor.cursor;
    }
  }
  *[Symbol.iterator]() {
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      yield cursor.data;
    }
  }
  get size() {
    let size = 0;
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      size++;
    }
    return size;
  }
  get isEmpty() {
    return this.head === null;
  }
  get first() {
    return this.head && this.head.data;
  }
  get last() {
    return this.tail && this.tail.data;
  }
  fromArray(array) {
    let cursor = null;
    this.head = null;
    for (let data of array) {
      const item = List.createItem(data);
      if (cursor !== null) {
        cursor.next = item;
      } else {
        this.head = item;
      }
      item.prev = cursor;
      cursor = item;
    }
    this.tail = cursor;
    return this;
  }
  toArray() {
    return [...this];
  }
  toJSON() {
    return [...this];
  }
  forEach(fn, thisArg = this) {
    const cursor = this.allocateCursor(null, this.head);
    while (cursor.next !== null) {
      const item = cursor.next;
      cursor.next = item.next;
      fn.call(thisArg, item.data, item, this);
    }
    this.releaseCursor();
  }
  forEachRight(fn, thisArg = this) {
    const cursor = this.allocateCursor(this.tail, null);
    while (cursor.prev !== null) {
      const item = cursor.prev;
      cursor.prev = item.prev;
      fn.call(thisArg, item.data, item, this);
    }
    this.releaseCursor();
  }
  reduce(fn, initialValue, thisArg = this) {
    let cursor = this.allocateCursor(null, this.head);
    let acc = initialValue;
    let item;
    while (cursor.next !== null) {
      item = cursor.next;
      cursor.next = item.next;
      acc = fn.call(thisArg, acc, item.data, item, this);
    }
    this.releaseCursor();
    return acc;
  }
  reduceRight(fn, initialValue, thisArg = this) {
    let cursor = this.allocateCursor(this.tail, null);
    let acc = initialValue;
    let item;
    while (cursor.prev !== null) {
      item = cursor.prev;
      cursor.prev = item.prev;
      acc = fn.call(thisArg, acc, item.data, item, this);
    }
    this.releaseCursor();
    return acc;
  }
  some(fn, thisArg = this) {
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      if (fn.call(thisArg, cursor.data, cursor, this)) {
        return true;
      }
    }
    return false;
  }
  map(fn, thisArg = this) {
    const result = new List();
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      result.appendData(fn.call(thisArg, cursor.data, cursor, this));
    }
    return result;
  }
  filter(fn, thisArg = this) {
    const result = new List();
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      if (fn.call(thisArg, cursor.data, cursor, this)) {
        result.appendData(cursor.data);
      }
    }
    return result;
  }
  nextUntil(start, fn, thisArg = this) {
    if (start === null) {
      return;
    }
    const cursor = this.allocateCursor(null, start);
    while (cursor.next !== null) {
      const item = cursor.next;
      cursor.next = item.next;
      if (fn.call(thisArg, item.data, item, this)) {
        break;
      }
    }
    this.releaseCursor();
  }
  prevUntil(start, fn, thisArg = this) {
    if (start === null) {
      return;
    }
    const cursor = this.allocateCursor(start, null);
    while (cursor.prev !== null) {
      const item = cursor.prev;
      cursor.prev = item.prev;
      if (fn.call(thisArg, item.data, item, this)) {
        break;
      }
    }
    this.releaseCursor();
  }
  clear() {
    this.head = null;
    this.tail = null;
  }
  copy() {
    const result = new List();
    for (let data of this) {
      result.appendData(data);
    }
    return result;
  }
  prepend(item) {
    this.updateCursors(null, item, this.head, item);
    if (this.head !== null) {
      this.head.prev = item;
      item.next = this.head;
    } else {
      this.tail = item;
    }
    this.head = item;
    return this;
  }
  prependData(data) {
    return this.prepend(List.createItem(data));
  }
  append(item) {
    return this.insert(item);
  }
  appendData(data) {
    return this.insert(List.createItem(data));
  }
  insert(item, before = null) {
    if (before !== null) {
      this.updateCursors(before.prev, item, before, item);
      if (before.prev === null) {
        if (this.head !== before) {
          throw new Error("before doesn't belong to list");
        }
        this.head = item;
        before.prev = item;
        item.next = before;
        this.updateCursors(null, item);
      } else {
        before.prev.next = item;
        item.prev = before.prev;
        before.prev = item;
        item.next = before;
      }
    } else {
      this.updateCursors(this.tail, item, null, item);
      if (this.tail !== null) {
        this.tail.next = item;
        item.prev = this.tail;
      } else {
        this.head = item;
      }
      this.tail = item;
    }
    return this;
  }
  insertData(data, before) {
    return this.insert(List.createItem(data), before);
  }
  remove(item) {
    this.updateCursors(item, item.prev, item, item.next);
    if (item.prev !== null) {
      item.prev.next = item.next;
    } else {
      if (this.head !== item) {
        throw new Error("item doesn't belong to list");
      }
      this.head = item.next;
    }
    if (item.next !== null) {
      item.next.prev = item.prev;
    } else {
      if (this.tail !== item) {
        throw new Error("item doesn't belong to list");
      }
      this.tail = item.prev;
    }
    item.prev = null;
    item.next = null;
    return item;
  }
  push(data) {
    this.insert(List.createItem(data));
  }
  pop() {
    return this.tail !== null ? this.remove(this.tail) : null;
  }
  unshift(data) {
    this.prepend(List.createItem(data));
  }
  shift() {
    return this.head !== null ? this.remove(this.head) : null;
  }
  prependList(list) {
    return this.insertList(list, this.head);
  }
  appendList(list) {
    return this.insertList(list);
  }
  insertList(list, before) {
    if (list.head === null) {
      return this;
    }
    if (before !== void 0 && before !== null) {
      this.updateCursors(before.prev, list.tail, before, list.head);
      if (before.prev !== null) {
        before.prev.next = list.head;
        list.head.prev = before.prev;
      } else {
        this.head = list.head;
      }
      before.prev = list.tail;
      list.tail.next = before;
    } else {
      this.updateCursors(this.tail, list.tail, null, list.head);
      if (this.tail !== null) {
        this.tail.next = list.head;
        list.head.prev = this.tail;
      } else {
        this.head = list.head;
      }
      this.tail = list.tail;
    }
    list.head = null;
    list.tail = null;
    return this;
  }
  replace(oldItem, newItemOrList) {
    if ("head" in newItemOrList) {
      this.insertList(newItemOrList, oldItem);
    } else {
      this.insert(newItemOrList, oldItem);
    }
    this.remove(oldItem);
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/utils/create-custom-error.js
function createCustomError(name41, message) {
  const error = Object.create(SyntaxError.prototype);
  const errorStack = new Error();
  return Object.assign(error, {
    name: name41,
    message,
    get stack() {
      return (errorStack.stack || "").replace(/^(.+\n){1,3}/, `${name41}: ${message}
`);
    }
  });
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/parser/SyntaxError.js
var MAX_LINE_LENGTH = 100;
var OFFSET_CORRECTION = 60;
var TAB_REPLACEMENT = "    ";
function sourceFragment({ source, line, column }, extraLines) {
  function processLines(start, end) {
    return lines.slice(start, end).map((line2, idx) => String(start + idx + 1).padStart(maxNumLength) + " |" + line2).join("\n");
  }
  const lines = source.split(/\r\n?|\n|\f/);
  const startLine = Math.max(1, line - extraLines) - 1;
  const endLine = Math.min(line + extraLines, lines.length + 1);
  const maxNumLength = Math.max(4, String(endLine).length) + 1;
  let cutLeft = 0;
  column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;
  if (column > MAX_LINE_LENGTH) {
    cutLeft = column - OFFSET_CORRECTION + 3;
    column = OFFSET_CORRECTION - 2;
  }
  for (let i = startLine; i <= endLine; i++) {
    if (i >= 0 && i < lines.length) {
      lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
      lines[i] = (cutLeft > 0 && lines[i].length > cutLeft ? "\u2026" : "") + lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) + (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? "\u2026" : "");
    }
  }
  return [
    processLines(startLine, line),
    new Array(column + maxNumLength + 2).join("-") + "^",
    processLines(line, endLine)
  ].filter(Boolean).join("\n");
}
function SyntaxError2(message, source, offset, line, column) {
  const error = Object.assign(createCustomError("SyntaxError", message), {
    source,
    offset,
    line,
    column,
    sourceFragment(extraLines) {
      return sourceFragment({ source, line, column }, isNaN(extraLines) ? 0 : extraLines);
    },
    get formattedMessage() {
      return `Parse error: ${message}
` + sourceFragment({ source, line, column }, 2);
    }
  });
  return error;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/parser/sequence.js
function readSequence(recognizer) {
  const children = this.createList();
  let space = false;
  const context = {
    recognizer
  };
  while (!this.eof) {
    switch (this.tokenType) {
      case Comment:
        this.next();
        continue;
      case WhiteSpace:
        space = true;
        this.next();
        continue;
    }
    let child = recognizer.getNode.call(this, context);
    if (child === void 0) {
      break;
    }
    if (space) {
      if (recognizer.onWhiteSpace) {
        recognizer.onWhiteSpace.call(this, child, children, context);
      }
      space = false;
    }
    children.push(child);
  }
  if (space && recognizer.onWhiteSpace) {
    recognizer.onWhiteSpace.call(this, null, children, context);
  }
  return children;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/parser/create.js
var NOOP = () => {
};
var EXCLAMATIONMARK = 33;
var NUMBERSIGN = 35;
var SEMICOLON = 59;
var LEFTCURLYBRACKET = 123;
var NULL = 0;
function createParseContext(name41) {
  return function() {
    return this[name41]();
  };
}
function fetchParseValues(dict) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const name41 in dict) {
    const item = dict[name41];
    const fn = item.parse || item;
    if (fn) {
      result[name41] = fn;
    }
  }
  return result;
}
function processConfig(config) {
  const parseConfig = {
    context: /* @__PURE__ */ Object.create(null),
    scope: Object.assign(/* @__PURE__ */ Object.create(null), config.scope),
    atrule: fetchParseValues(config.atrule),
    pseudo: fetchParseValues(config.pseudo),
    node: fetchParseValues(config.node)
  };
  for (const name41 in config.parseContext) {
    switch (typeof config.parseContext[name41]) {
      case "function":
        parseConfig.context[name41] = config.parseContext[name41];
        break;
      case "string":
        parseConfig.context[name41] = createParseContext(config.parseContext[name41]);
        break;
    }
  }
  return {
    config: parseConfig,
    ...parseConfig,
    ...parseConfig.node
  };
}
function createParser(config) {
  let source = "";
  let filename = "<unknown>";
  let needPositions = false;
  let onParseError = NOOP;
  let onParseErrorThrow = false;
  const locationMap = new OffsetToLocation();
  const parser = Object.assign(new TokenStream(), processConfig(config || {}), {
    parseAtrulePrelude: true,
    parseRulePrelude: true,
    parseValue: true,
    parseCustomProperty: false,
    readSequence,
    consumeUntilBalanceEnd: () => 0,
    consumeUntilLeftCurlyBracket(code2) {
      return code2 === LEFTCURLYBRACKET ? 1 : 0;
    },
    consumeUntilLeftCurlyBracketOrSemicolon(code2) {
      return code2 === LEFTCURLYBRACKET || code2 === SEMICOLON ? 1 : 0;
    },
    consumeUntilExclamationMarkOrSemicolon(code2) {
      return code2 === EXCLAMATIONMARK || code2 === SEMICOLON ? 1 : 0;
    },
    consumeUntilSemicolonIncluded(code2) {
      return code2 === SEMICOLON ? 2 : 0;
    },
    createList() {
      return new List();
    },
    createSingleNodeList(node) {
      return new List().appendData(node);
    },
    getFirstListNode(list) {
      return list && list.first;
    },
    getLastListNode(list) {
      return list && list.last;
    },
    parseWithFallback(consumer, fallback) {
      const startToken = this.tokenIndex;
      try {
        return consumer.call(this);
      } catch (e) {
        if (onParseErrorThrow) {
          throw e;
        }
        const fallbackNode = fallback.call(this, startToken);
        onParseErrorThrow = true;
        onParseError(e, fallbackNode);
        onParseErrorThrow = false;
        return fallbackNode;
      }
    },
    lookupNonWSType(offset) {
      let type;
      do {
        type = this.lookupType(offset++);
        if (type !== WhiteSpace) {
          return type;
        }
      } while (type !== NULL);
      return NULL;
    },
    charCodeAt(offset) {
      return offset >= 0 && offset < source.length ? source.charCodeAt(offset) : 0;
    },
    substring(offsetStart, offsetEnd) {
      return source.substring(offsetStart, offsetEnd);
    },
    substrToCursor(start) {
      return this.source.substring(start, this.tokenStart);
    },
    cmpChar(offset, charCode) {
      return cmpChar(source, offset, charCode);
    },
    cmpStr(offsetStart, offsetEnd, str) {
      return cmpStr(source, offsetStart, offsetEnd, str);
    },
    consume(tokenType2) {
      const start = this.tokenStart;
      this.eat(tokenType2);
      return this.substrToCursor(start);
    },
    consumeFunctionName() {
      const name41 = source.substring(this.tokenStart, this.tokenEnd - 1);
      this.eat(Function2);
      return name41;
    },
    consumeNumber(type) {
      const number2 = source.substring(this.tokenStart, consumeNumber(source, this.tokenStart));
      this.eat(type);
      return number2;
    },
    eat(tokenType2) {
      if (this.tokenType !== tokenType2) {
        const tokenName = names_default[tokenType2].slice(0, -6).replace(/-/g, " ").replace(/^./, (m) => m.toUpperCase());
        let message = `${/[[\](){}]/.test(tokenName) ? `"${tokenName}"` : tokenName} is expected`;
        let offset = this.tokenStart;
        switch (tokenType2) {
          case Ident:
            if (this.tokenType === Function2 || this.tokenType === Url) {
              offset = this.tokenEnd - 1;
              message = "Identifier is expected but function found";
            } else {
              message = "Identifier is expected";
            }
            break;
          case Hash:
            if (this.isDelim(NUMBERSIGN)) {
              this.next();
              offset++;
              message = "Name is expected";
            }
            break;
          case Percentage:
            if (this.tokenType === Number2) {
              offset = this.tokenEnd;
              message = "Percent sign is expected";
            }
            break;
        }
        this.error(message, offset);
      }
      this.next();
    },
    eatIdent(name41) {
      if (this.tokenType !== Ident || this.lookupValue(0, name41) === false) {
        this.error(`Identifier "${name41}" is expected`);
      }
      this.next();
    },
    eatDelim(code2) {
      if (!this.isDelim(code2)) {
        this.error(`Delim "${String.fromCharCode(code2)}" is expected`);
      }
      this.next();
    },
    getLocation(start, end) {
      if (needPositions) {
        return locationMap.getLocationRange(start, end, filename);
      }
      return null;
    },
    getLocationFromList(list) {
      if (needPositions) {
        const head = this.getFirstListNode(list);
        const tail = this.getLastListNode(list);
        return locationMap.getLocationRange(head !== null ? head.loc.start.offset - locationMap.startOffset : this.tokenStart, tail !== null ? tail.loc.end.offset - locationMap.startOffset : this.tokenStart, filename);
      }
      return null;
    },
    error(message, offset) {
      const location = typeof offset !== "undefined" && offset < source.length ? locationMap.getLocation(offset) : this.eof ? locationMap.getLocation(findWhiteSpaceStart(source, source.length - 1)) : locationMap.getLocation(this.tokenStart);
      throw new SyntaxError2(message || "Unexpected input", source, location.offset, location.line, location.column);
    }
  });
  const parse43 = function(source_, options) {
    source = source_;
    options = options || {};
    parser.setSource(source, tokenize);
    locationMap.setSource(source, options.offset, options.line, options.column);
    filename = options.filename || "<unknown>";
    needPositions = Boolean(options.positions);
    onParseError = typeof options.onParseError === "function" ? options.onParseError : NOOP;
    onParseErrorThrow = false;
    parser.parseAtrulePrelude = "parseAtrulePrelude" in options ? Boolean(options.parseAtrulePrelude) : true;
    parser.parseRulePrelude = "parseRulePrelude" in options ? Boolean(options.parseRulePrelude) : true;
    parser.parseValue = "parseValue" in options ? Boolean(options.parseValue) : true;
    parser.parseCustomProperty = "parseCustomProperty" in options ? Boolean(options.parseCustomProperty) : false;
    const { context = "default", onComment } = options;
    if (context in parser.context === false) {
      throw new Error("Unknown context `" + context + "`");
    }
    if (typeof onComment === "function") {
      parser.forEachToken((type, start, end) => {
        if (type === Comment) {
          const loc = parser.getLocation(start, end);
          const value = cmpStr(source, end - 2, end, "*/") ? source.slice(start + 2, end - 2) : source.slice(start + 2, end);
          onComment(value, loc);
        }
      });
    }
    const ast = parser.context[context].call(parser, options);
    if (!parser.eof) {
      parser.error();
    }
    return ast;
  };
  return Object.assign(parse43, {
    SyntaxError: SyntaxError2,
    config: parser.config
  });
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/generator/sourceMap.js
var import_source_map_generator = __toESM(require_source_map_generator(), 1);
var trackNodes = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
function generateSourceMap(handlers) {
  const map = new import_source_map_generator.SourceMapGenerator();
  const generated = {
    line: 1,
    column: 0
  };
  const original = {
    line: 0,
    column: 0
  };
  const activatedGenerated = {
    line: 1,
    column: 0
  };
  const activatedMapping = {
    generated: activatedGenerated
  };
  let line = 1;
  let column = 0;
  let sourceMappingActive = false;
  const origHandlersNode = handlers.node;
  handlers.node = function(node) {
    if (node.loc && node.loc.start && trackNodes.has(node.type)) {
      const nodeLine = node.loc.start.line;
      const nodeColumn = node.loc.start.column - 1;
      if (original.line !== nodeLine || original.column !== nodeColumn) {
        original.line = nodeLine;
        original.column = nodeColumn;
        generated.line = line;
        generated.column = column;
        if (sourceMappingActive) {
          sourceMappingActive = false;
          if (generated.line !== activatedGenerated.line || generated.column !== activatedGenerated.column) {
            map.addMapping(activatedMapping);
          }
        }
        sourceMappingActive = true;
        map.addMapping({
          source: node.loc.source,
          original,
          generated
        });
      }
    }
    origHandlersNode.call(this, node);
    if (sourceMappingActive && trackNodes.has(node.type)) {
      activatedGenerated.line = line;
      activatedGenerated.column = column;
    }
  };
  const origHandlersEmit = handlers.emit;
  handlers.emit = function(value, type, auto) {
    for (let i = 0; i < value.length; i++) {
      if (value.charCodeAt(i) === 10) {
        line++;
        column = 0;
      } else {
        column++;
      }
    }
    origHandlersEmit(value, type, auto);
  };
  const origHandlersResult = handlers.result;
  handlers.result = function() {
    if (sourceMappingActive) {
      map.addMapping(activatedMapping);
    }
    return {
      css: origHandlersResult(),
      map
    };
  };
  return handlers;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/generator/token-before.js
var token_before_exports = {};
__export(token_before_exports, {
  safe: () => safe,
  spec: () => spec
});
var PLUSSIGN = 43;
var HYPHENMINUS = 45;
var code = (type, value) => {
  if (type === Delim) {
    type = value;
  }
  if (typeof type === "string") {
    const charCode = type.charCodeAt(0);
    return charCode > 127 ? 32768 : charCode << 8;
  }
  return type;
};
var specPairs = [
  [Ident, Ident],
  [Ident, Function2],
  [Ident, Url],
  [Ident, BadUrl],
  [Ident, "-"],
  [Ident, Number2],
  [Ident, Percentage],
  [Ident, Dimension],
  [Ident, CDC],
  [Ident, LeftParenthesis],
  [AtKeyword, Ident],
  [AtKeyword, Function2],
  [AtKeyword, Url],
  [AtKeyword, BadUrl],
  [AtKeyword, "-"],
  [AtKeyword, Number2],
  [AtKeyword, Percentage],
  [AtKeyword, Dimension],
  [AtKeyword, CDC],
  [Hash, Ident],
  [Hash, Function2],
  [Hash, Url],
  [Hash, BadUrl],
  [Hash, "-"],
  [Hash, Number2],
  [Hash, Percentage],
  [Hash, Dimension],
  [Hash, CDC],
  [Dimension, Ident],
  [Dimension, Function2],
  [Dimension, Url],
  [Dimension, BadUrl],
  [Dimension, "-"],
  [Dimension, Number2],
  [Dimension, Percentage],
  [Dimension, Dimension],
  [Dimension, CDC],
  ["#", Ident],
  ["#", Function2],
  ["#", Url],
  ["#", BadUrl],
  ["#", "-"],
  ["#", Number2],
  ["#", Percentage],
  ["#", Dimension],
  ["#", CDC],
  ["-", Ident],
  ["-", Function2],
  ["-", Url],
  ["-", BadUrl],
  ["-", "-"],
  ["-", Number2],
  ["-", Percentage],
  ["-", Dimension],
  ["-", CDC],
  [Number2, Ident],
  [Number2, Function2],
  [Number2, Url],
  [Number2, BadUrl],
  [Number2, Number2],
  [Number2, Percentage],
  [Number2, Dimension],
  [Number2, "%"],
  [Number2, CDC],
  ["@", Ident],
  ["@", Function2],
  ["@", Url],
  ["@", BadUrl],
  ["@", "-"],
  ["@", CDC],
  [".", Number2],
  [".", Percentage],
  [".", Dimension],
  ["+", Number2],
  ["+", Percentage],
  ["+", Dimension],
  ["/", "*"]
];
var safePairs = specPairs.concat([
  [Ident, Hash],
  [Dimension, Hash],
  [Hash, Hash],
  [AtKeyword, LeftParenthesis],
  [AtKeyword, String2],
  [AtKeyword, Colon],
  [Percentage, Percentage],
  [Percentage, Dimension],
  [Percentage, Function2],
  [Percentage, "-"],
  [RightParenthesis, Ident],
  [RightParenthesis, Function2],
  [RightParenthesis, Percentage],
  [RightParenthesis, Dimension],
  [RightParenthesis, Hash],
  [RightParenthesis, "-"]
]);
function createMap(pairs) {
  const isWhiteSpaceRequired = new Set(pairs.map(([prev, next]) => code(prev) << 16 | code(next)));
  return function(prevCode, type, value) {
    const nextCode = code(type, value);
    const nextCharCode = value.charCodeAt(0);
    const emitWs = nextCharCode === HYPHENMINUS && type !== Ident && type !== Function2 && type !== CDC || nextCharCode === PLUSSIGN ? isWhiteSpaceRequired.has(prevCode << 16 | nextCharCode << 8) : isWhiteSpaceRequired.has(prevCode << 16 | nextCode);
    if (emitWs) {
      this.emit(" ", WhiteSpace, true);
    }
    return nextCode;
  };
}
var spec = createMap(specPairs);
var safe = createMap(safePairs);

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/generator/create.js
var REVERSESOLIDUS = 92;
function processChildren(node, delimeter) {
  if (typeof delimeter === "function") {
    let prev = null;
    node.children.forEach((node2) => {
      if (prev !== null) {
        delimeter.call(this, prev);
      }
      this.node(node2);
      prev = node2;
    });
    return;
  }
  node.children.forEach(this.node, this);
}
function processChunk(chunk) {
  tokenize(chunk, (type, start, end) => {
    this.token(type, chunk.slice(start, end));
  });
}
function createGenerator(config) {
  const types = /* @__PURE__ */ new Map();
  for (let name41 in config.node) {
    const item = config.node[name41];
    const fn = item.generate || item;
    if (typeof fn === "function") {
      types.set(name41, item.generate || item);
    }
  }
  return function(node, options) {
    let buffer = "";
    let prevCode = 0;
    let handlers = {
      node(node2) {
        if (types.has(node2.type)) {
          types.get(node2.type).call(publicApi, node2);
        } else {
          throw new Error("Unknown node type: " + node2.type);
        }
      },
      tokenBefore: safe,
      token(type, value) {
        prevCode = this.tokenBefore(prevCode, type, value);
        this.emit(value, type, false);
        if (type === Delim && value.charCodeAt(0) === REVERSESOLIDUS) {
          this.emit("\n", WhiteSpace, true);
        }
      },
      emit(value) {
        buffer += value;
      },
      result() {
        return buffer;
      }
    };
    if (options) {
      if (typeof options.decorator === "function") {
        handlers = options.decorator(handlers);
      }
      if (options.sourceMap) {
        handlers = generateSourceMap(handlers);
      }
      if (options.mode in token_before_exports) {
        handlers.tokenBefore = token_before_exports[options.mode];
      }
    }
    const publicApi = {
      node: (node2) => handlers.node(node2),
      children: processChildren,
      token: (type, value) => handlers.token(type, value),
      tokenize: processChunk
    };
    handlers.node(node);
    return handlers.result();
  };
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/convertor/create.js
function createConvertor(walk3) {
  return {
    fromPlainObject: function(ast) {
      walk3(ast, {
        enter: function(node) {
          if (node.children && node.children instanceof List === false) {
            node.children = new List().fromArray(node.children);
          }
        }
      });
      return ast;
    },
    toPlainObject: function(ast) {
      walk3(ast, {
        leave: function(node) {
          if (node.children && node.children instanceof List) {
            node.children = node.children.toArray();
          }
        }
      });
      return ast;
    }
  };
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/walker/create.js
var { hasOwnProperty: hasOwnProperty2 } = Object.prototype;
var noop = function() {
};
function ensureFunction(value) {
  return typeof value === "function" ? value : noop;
}
function invokeForType(fn, type) {
  return function(node, item, list) {
    if (node.type === type) {
      fn.call(this, node, item, list);
    }
  };
}
function getWalkersFromStructure(name41, nodeType) {
  const structure41 = nodeType.structure;
  const walkers = [];
  for (const key in structure41) {
    if (hasOwnProperty2.call(structure41, key) === false) {
      continue;
    }
    let fieldTypes = structure41[key];
    const walker = {
      name: key,
      type: false,
      nullable: false
    };
    if (!Array.isArray(fieldTypes)) {
      fieldTypes = [fieldTypes];
    }
    for (const fieldType of fieldTypes) {
      if (fieldType === null) {
        walker.nullable = true;
      } else if (typeof fieldType === "string") {
        walker.type = "node";
      } else if (Array.isArray(fieldType)) {
        walker.type = "list";
      }
    }
    if (walker.type) {
      walkers.push(walker);
    }
  }
  if (walkers.length) {
    return {
      context: nodeType.walkContext,
      fields: walkers
    };
  }
  return null;
}
function getTypesFromConfig(config) {
  const types = {};
  for (const name41 in config.node) {
    if (hasOwnProperty2.call(config.node, name41)) {
      const nodeType = config.node[name41];
      if (!nodeType.structure) {
        throw new Error("Missed `structure` field in `" + name41 + "` node type definition");
      }
      types[name41] = getWalkersFromStructure(name41, nodeType);
    }
  }
  return types;
}
function createTypeIterator(config, reverse) {
  const fields = config.fields.slice();
  const contextName = config.context;
  const useContext = typeof contextName === "string";
  if (reverse) {
    fields.reverse();
  }
  return function(node, context, walk3, walkReducer) {
    let prevContextValue;
    if (useContext) {
      prevContextValue = context[contextName];
      context[contextName] = node;
    }
    for (const field of fields) {
      const ref = node[field.name];
      if (!field.nullable || ref) {
        if (field.type === "list") {
          const breakWalk = reverse ? ref.reduceRight(walkReducer, false) : ref.reduce(walkReducer, false);
          if (breakWalk) {
            return true;
          }
        } else if (walk3(ref)) {
          return true;
        }
      }
    }
    if (useContext) {
      context[contextName] = prevContextValue;
    }
  };
}
function createFastTraveralMap({
  StyleSheet,
  Atrule,
  Rule,
  Block,
  DeclarationList
}) {
  return {
    Atrule: {
      StyleSheet,
      Atrule,
      Rule,
      Block
    },
    Rule: {
      StyleSheet,
      Atrule,
      Rule,
      Block
    },
    Declaration: {
      StyleSheet,
      Atrule,
      Rule,
      Block,
      DeclarationList
    }
  };
}
function createWalker(config) {
  const types = getTypesFromConfig(config);
  const iteratorsNatural = {};
  const iteratorsReverse = {};
  const breakWalk = Symbol("break-walk");
  const skipNode = Symbol("skip-node");
  for (const name41 in types) {
    if (hasOwnProperty2.call(types, name41) && types[name41] !== null) {
      iteratorsNatural[name41] = createTypeIterator(types[name41], false);
      iteratorsReverse[name41] = createTypeIterator(types[name41], true);
    }
  }
  const fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
  const fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);
  const walk3 = function(root, options) {
    function walkNode(node, item, list) {
      const enterRet = enter.call(context, node, item, list);
      if (enterRet === breakWalk) {
        return true;
      }
      if (enterRet === skipNode) {
        return false;
      }
      if (iterators.hasOwnProperty(node.type)) {
        if (iterators[node.type](node, context, walkNode, walkReducer)) {
          return true;
        }
      }
      if (leave.call(context, node, item, list) === breakWalk) {
        return true;
      }
      return false;
    }
    let enter = noop;
    let leave = noop;
    let iterators = iteratorsNatural;
    let walkReducer = (ret, data, item, list) => ret || walkNode(data, item, list);
    const context = {
      break: breakWalk,
      skip: skipNode,
      root,
      stylesheet: null,
      atrule: null,
      atrulePrelude: null,
      rule: null,
      selector: null,
      block: null,
      declaration: null,
      function: null
    };
    if (typeof options === "function") {
      enter = options;
    } else if (options) {
      enter = ensureFunction(options.enter);
      leave = ensureFunction(options.leave);
      if (options.reverse) {
        iterators = iteratorsReverse;
      }
      if (options.visit) {
        if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
          iterators = options.reverse ? fastTraversalIteratorsReverse[options.visit] : fastTraversalIteratorsNatural[options.visit];
        } else if (!types.hasOwnProperty(options.visit)) {
          throw new Error("Bad value `" + options.visit + "` for `visit` option (should be: " + Object.keys(types).sort().join(", ") + ")");
        }
        enter = invokeForType(enter, options.visit);
        leave = invokeForType(leave, options.visit);
      }
    }
    if (enter === noop && leave === noop) {
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    }
    walkNode(root);
  };
  walk3.break = breakWalk;
  walk3.skip = skipNode;
  walk3.find = function(ast, fn) {
    let found = null;
    walk3(ast, function(node, item, list) {
      if (fn.call(this, node, item, list)) {
        found = node;
        return breakWalk;
      }
    });
    return found;
  };
  walk3.findLast = function(ast, fn) {
    let found = null;
    walk3(ast, {
      reverse: true,
      enter: function(node, item, list) {
        if (fn.call(this, node, item, list)) {
          found = node;
          return breakWalk;
        }
      }
    });
    return found;
  };
  walk3.findAll = function(ast, fn) {
    const found = [];
    walk3(ast, function(node, item, list) {
      if (fn.call(this, node, item, list)) {
        found.push(node);
      }
    });
    return found;
  };
  return walk3;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/definition-syntax/generate.js
function noop2(value) {
  return value;
}
function generateMultiplier(multiplier) {
  const { min, max, comma } = multiplier;
  if (min === 0 && max === 0) {
    return "*";
  }
  if (min === 0 && max === 1) {
    return "?";
  }
  if (min === 1 && max === 0) {
    return comma ? "#" : "+";
  }
  if (min === 1 && max === 1) {
    return "";
  }
  return (comma ? "#" : "") + (min === max ? "{" + min + "}" : "{" + min + "," + (max !== 0 ? max : "") + "}");
}
function generateTypeOpts(node) {
  switch (node.type) {
    case "Range":
      return " [" + (node.min === null ? "-\u221E" : node.min) + "," + (node.max === null ? "\u221E" : node.max) + "]";
    default:
      throw new Error("Unknown node type `" + node.type + "`");
  }
}
function generateSequence(node, decorate, forceBraces, compact) {
  const combinator = node.combinator === " " || compact ? node.combinator : " " + node.combinator + " ";
  const result = node.terms.map((term) => internalGenerate(term, decorate, forceBraces, compact)).join(combinator);
  if (node.explicit || forceBraces) {
    return (compact || result[0] === "," ? "[" : "[ ") + result + (compact ? "]" : " ]");
  }
  return result;
}
function internalGenerate(node, decorate, forceBraces, compact) {
  let result;
  switch (node.type) {
    case "Group":
      result = generateSequence(node, decorate, forceBraces, compact) + (node.disallowEmpty ? "!" : "");
      break;
    case "Multiplier":
      return internalGenerate(node.term, decorate, forceBraces, compact) + decorate(generateMultiplier(node), node);
    case "Type":
      result = "<" + node.name + (node.opts ? decorate(generateTypeOpts(node.opts), node.opts) : "") + ">";
      break;
    case "Property":
      result = "<'" + node.name + "'>";
      break;
    case "Keyword":
      result = node.name;
      break;
    case "AtKeyword":
      result = "@" + node.name;
      break;
    case "Function":
      result = node.name + "(";
      break;
    case "String":
    case "Token":
      result = node.value;
      break;
    case "Comma":
      result = ",";
      break;
    default:
      throw new Error("Unknown node type `" + node.type + "`");
  }
  return decorate(result, node);
}
function generate(node, options) {
  let decorate = noop2;
  let forceBraces = false;
  let compact = false;
  if (typeof options === "function") {
    decorate = options;
  } else if (options) {
    forceBraces = Boolean(options.forceBraces);
    compact = Boolean(options.compact);
    if (typeof options.decorate === "function") {
      decorate = options.decorate;
    }
  }
  return internalGenerate(node, decorate, forceBraces, compact);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/error.js
var defaultLoc = { offset: 0, line: 1, column: 1 };
function locateMismatch(matchResult, node) {
  const tokens = matchResult.tokens;
  const longestMatch = matchResult.longestMatch;
  const mismatchNode = longestMatch < tokens.length ? tokens[longestMatch].node || null : null;
  const badNode = mismatchNode !== node ? mismatchNode : null;
  let mismatchOffset = 0;
  let mismatchLength = 0;
  let entries = 0;
  let css = "";
  let start;
  let end;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].value;
    if (i === longestMatch) {
      mismatchLength = token.length;
      mismatchOffset = css.length;
    }
    if (badNode !== null && tokens[i].node === badNode) {
      if (i <= longestMatch) {
        entries++;
      } else {
        entries = 0;
      }
    }
    css += token;
  }
  if (longestMatch === tokens.length || entries > 1) {
    start = fromLoc(badNode || node, "end") || buildLoc(defaultLoc, css);
    end = buildLoc(start);
  } else {
    start = fromLoc(badNode, "start") || buildLoc(fromLoc(node, "start") || defaultLoc, css.slice(0, mismatchOffset));
    end = fromLoc(badNode, "end") || buildLoc(start, css.substr(mismatchOffset, mismatchLength));
  }
  return {
    css,
    mismatchOffset,
    mismatchLength,
    start,
    end
  };
}
function fromLoc(node, point) {
  const value = node && node.loc && node.loc[point];
  if (value) {
    return "line" in value ? buildLoc(value) : value;
  }
  return null;
}
function buildLoc({ offset, line, column }, extra) {
  const loc = {
    offset,
    line,
    column
  };
  if (extra) {
    const lines = extra.split(/\n|\r\n?|\f/);
    loc.offset += extra.length;
    loc.line += lines.length - 1;
    loc.column = lines.length === 1 ? loc.column + extra.length : lines.pop().length + 1;
  }
  return loc;
}
var SyntaxReferenceError = function(type, referenceName) {
  const error = createCustomError("SyntaxReferenceError", type + (referenceName ? " `" + referenceName + "`" : ""));
  error.reference = referenceName;
  return error;
};
var SyntaxMatchError = function(message, syntax, node, matchResult) {
  const error = createCustomError("SyntaxMatchError", message);
  const {
    css,
    mismatchOffset,
    mismatchLength,
    start,
    end
  } = locateMismatch(matchResult, node);
  error.rawMessage = message;
  error.syntax = syntax ? generate(syntax) : "<generic>";
  error.css = css;
  error.mismatchOffset = mismatchOffset;
  error.mismatchLength = mismatchLength;
  error.message = message + "\n  syntax: " + error.syntax + "\n   value: " + (css || "<empty string>") + "\n  --------" + new Array(error.mismatchOffset + 1).join("-") + "^";
  Object.assign(error, start);
  error.loc = {
    source: node && node.loc && node.loc.source || "<unknown>",
    start,
    end
  };
  return error;
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/utils/names.js
var keywords = /* @__PURE__ */ new Map();
var properties = /* @__PURE__ */ new Map();
var HYPHENMINUS2 = 45;
var keyword = getKeywordDescriptor;
var property = getPropertyDescriptor;
function isCustomProperty(str, offset) {
  offset = offset || 0;
  return str.length - offset >= 2 && str.charCodeAt(offset) === HYPHENMINUS2 && str.charCodeAt(offset + 1) === HYPHENMINUS2;
}
function getVendorPrefix(str, offset) {
  offset = offset || 0;
  if (str.length - offset >= 3) {
    if (str.charCodeAt(offset) === HYPHENMINUS2 && str.charCodeAt(offset + 1) !== HYPHENMINUS2) {
      const secondDashIndex = str.indexOf("-", offset + 2);
      if (secondDashIndex !== -1) {
        return str.substring(offset, secondDashIndex + 1);
      }
    }
  }
  return "";
}
function getKeywordDescriptor(keyword2) {
  if (keywords.has(keyword2)) {
    return keywords.get(keyword2);
  }
  const name41 = keyword2.toLowerCase();
  let descriptor = keywords.get(name41);
  if (descriptor === void 0) {
    const custom = isCustomProperty(name41, 0);
    const vendor = !custom ? getVendorPrefix(name41, 0) : "";
    descriptor = Object.freeze({
      basename: name41.substr(vendor.length),
      name: name41,
      prefix: vendor,
      vendor,
      custom
    });
  }
  keywords.set(keyword2, descriptor);
  return descriptor;
}
function getPropertyDescriptor(property2) {
  if (properties.has(property2)) {
    return properties.get(property2);
  }
  let name41 = property2;
  let hack = property2[0];
  if (hack === "/") {
    hack = property2[1] === "/" ? "//" : "/";
  } else if (hack !== "_" && hack !== "*" && hack !== "$" && hack !== "#" && hack !== "+" && hack !== "&") {
    hack = "";
  }
  const custom = isCustomProperty(name41, hack.length);
  if (!custom) {
    name41 = name41.toLowerCase();
    if (properties.has(name41)) {
      const descriptor2 = properties.get(name41);
      properties.set(property2, descriptor2);
      return descriptor2;
    }
  }
  const vendor = !custom ? getVendorPrefix(name41, hack.length) : "";
  const prefix = name41.substr(0, hack.length + vendor.length);
  const descriptor = Object.freeze({
    basename: name41.substr(prefix.length),
    name: name41.substr(hack.length),
    hack,
    vendor,
    prefix,
    custom
  });
  properties.set(property2, descriptor);
  return descriptor;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/generic-an-plus-b.js
var PLUSSIGN2 = 43;
var HYPHENMINUS3 = 45;
var N2 = 110;
var DISALLOW_SIGN = true;
var ALLOW_SIGN = false;
function isDelim(token, code2) {
  return token !== null && token.type === Delim && token.value.charCodeAt(0) === code2;
}
function skipSC(token, offset, getNextToken) {
  while (token !== null && (token.type === WhiteSpace || token.type === Comment)) {
    token = getNextToken(++offset);
  }
  return offset;
}
function checkInteger(token, valueOffset, disallowSign, offset) {
  if (!token) {
    return 0;
  }
  const code2 = token.value.charCodeAt(valueOffset);
  if (code2 === PLUSSIGN2 || code2 === HYPHENMINUS3) {
    if (disallowSign) {
      return 0;
    }
    valueOffset++;
  }
  for (; valueOffset < token.value.length; valueOffset++) {
    if (!isDigit(token.value.charCodeAt(valueOffset))) {
      return 0;
    }
  }
  return offset + 1;
}
function consumeB(token, offset_, getNextToken) {
  let sign = false;
  let offset = skipSC(token, offset_, getNextToken);
  token = getNextToken(offset);
  if (token === null) {
    return offset_;
  }
  if (token.type !== Number2) {
    if (isDelim(token, PLUSSIGN2) || isDelim(token, HYPHENMINUS3)) {
      sign = true;
      offset = skipSC(getNextToken(++offset), offset, getNextToken);
      token = getNextToken(offset);
      if (token === null || token.type !== Number2) {
        return 0;
      }
    } else {
      return offset_;
    }
  }
  if (!sign) {
    const code2 = token.value.charCodeAt(0);
    if (code2 !== PLUSSIGN2 && code2 !== HYPHENMINUS3) {
      return 0;
    }
  }
  return checkInteger(token, sign ? 0 : 1, sign, offset);
}
function anPlusB(token, getNextToken) {
  let offset = 0;
  if (!token) {
    return 0;
  }
  if (token.type === Number2) {
    return checkInteger(token, 0, ALLOW_SIGN, offset);
  } else if (token.type === Ident && token.value.charCodeAt(0) === HYPHENMINUS3) {
    if (!cmpChar(token.value, 1, N2)) {
      return 0;
    }
    switch (token.value.length) {
      case 2:
        return consumeB(getNextToken(++offset), offset, getNextToken);
      case 3:
        if (token.value.charCodeAt(2) !== HYPHENMINUS3) {
          return 0;
        }
        offset = skipSC(getNextToken(++offset), offset, getNextToken);
        token = getNextToken(offset);
        return checkInteger(token, 0, DISALLOW_SIGN, offset);
      default:
        if (token.value.charCodeAt(2) !== HYPHENMINUS3) {
          return 0;
        }
        return checkInteger(token, 3, DISALLOW_SIGN, offset);
    }
  } else if (token.type === Ident || isDelim(token, PLUSSIGN2) && getNextToken(offset + 1).type === Ident) {
    if (token.type !== Ident) {
      token = getNextToken(++offset);
    }
    if (token === null || !cmpChar(token.value, 0, N2)) {
      return 0;
    }
    switch (token.value.length) {
      case 1:
        return consumeB(getNextToken(++offset), offset, getNextToken);
      case 2:
        if (token.value.charCodeAt(1) !== HYPHENMINUS3) {
          return 0;
        }
        offset = skipSC(getNextToken(++offset), offset, getNextToken);
        token = getNextToken(offset);
        return checkInteger(token, 0, DISALLOW_SIGN, offset);
      default:
        if (token.value.charCodeAt(1) !== HYPHENMINUS3) {
          return 0;
        }
        return checkInteger(token, 2, DISALLOW_SIGN, offset);
    }
  } else if (token.type === Dimension) {
    let code2 = token.value.charCodeAt(0);
    let sign = code2 === PLUSSIGN2 || code2 === HYPHENMINUS3 ? 1 : 0;
    let i = sign;
    for (; i < token.value.length; i++) {
      if (!isDigit(token.value.charCodeAt(i))) {
        break;
      }
    }
    if (i === sign) {
      return 0;
    }
    if (!cmpChar(token.value, i, N2)) {
      return 0;
    }
    if (i + 1 === token.value.length) {
      return consumeB(getNextToken(++offset), offset, getNextToken);
    } else {
      if (token.value.charCodeAt(i + 1) !== HYPHENMINUS3) {
        return 0;
      }
      if (i + 2 === token.value.length) {
        offset = skipSC(getNextToken(++offset), offset, getNextToken);
        token = getNextToken(offset);
        return checkInteger(token, 0, DISALLOW_SIGN, offset);
      } else {
        return checkInteger(token, i + 2, DISALLOW_SIGN, offset);
      }
    }
  }
  return 0;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/generic-urange.js
var PLUSSIGN3 = 43;
var HYPHENMINUS4 = 45;
var QUESTIONMARK = 63;
var U = 117;
function isDelim2(token, code2) {
  return token !== null && token.type === Delim && token.value.charCodeAt(0) === code2;
}
function startsWith(token, code2) {
  return token.value.charCodeAt(0) === code2;
}
function hexSequence(token, offset, allowDash) {
  let hexlen = 0;
  for (let pos = offset; pos < token.value.length; pos++) {
    const code2 = token.value.charCodeAt(pos);
    if (code2 === HYPHENMINUS4 && allowDash && hexlen !== 0) {
      hexSequence(token, offset + hexlen + 1, false);
      return 6;
    }
    if (!isHexDigit(code2)) {
      return 0;
    }
    if (++hexlen > 6) {
      return 0;
    }
    ;
  }
  return hexlen;
}
function withQuestionMarkSequence(consumed, length, getNextToken) {
  if (!consumed) {
    return 0;
  }
  while (isDelim2(getNextToken(length), QUESTIONMARK)) {
    if (++consumed > 6) {
      return 0;
    }
    length++;
  }
  return length;
}
function urange(token, getNextToken) {
  let length = 0;
  if (token === null || token.type !== Ident || !cmpChar(token.value, 0, U)) {
    return 0;
  }
  token = getNextToken(++length);
  if (token === null) {
    return 0;
  }
  if (isDelim2(token, PLUSSIGN3)) {
    token = getNextToken(++length);
    if (token === null) {
      return 0;
    }
    if (token.type === Ident) {
      return withQuestionMarkSequence(hexSequence(token, 0, true), ++length, getNextToken);
    }
    if (isDelim2(token, QUESTIONMARK)) {
      return withQuestionMarkSequence(1, ++length, getNextToken);
    }
    return 0;
  }
  if (token.type === Number2) {
    const consumedHexLength = hexSequence(token, 1, true);
    if (consumedHexLength === 0) {
      return 0;
    }
    token = getNextToken(++length);
    if (token === null) {
      return length;
    }
    if (token.type === Dimension || token.type === Number2) {
      if (!startsWith(token, HYPHENMINUS4) || !hexSequence(token, 1, false)) {
        return 0;
      }
      return length + 1;
    }
    return withQuestionMarkSequence(consumedHexLength, length, getNextToken);
  }
  if (token.type === Dimension) {
    return withQuestionMarkSequence(hexSequence(token, 1, true), ++length, getNextToken);
  }
  return 0;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/generic.js
var cssWideKeywords = ["unset", "initial", "inherit"];
var calcFunctionNames = ["calc(", "-moz-calc(", "-webkit-calc("];
var balancePair2 = /* @__PURE__ */ new Map([
  [Function2, RightParenthesis],
  [LeftParenthesis, RightParenthesis],
  [LeftSquareBracket, RightSquareBracket],
  [LeftCurlyBracket, RightCurlyBracket]
]);
var LENGTH = [
  "px",
  "mm",
  "cm",
  "in",
  "pt",
  "pc",
  "q",
  "em",
  "ex",
  "ch",
  "rem",
  "vh",
  "vw",
  "vmin",
  "vmax",
  "vm"
];
var ANGLE = ["deg", "grad", "rad", "turn"];
var TIME = ["s", "ms"];
var FREQUENCY = ["hz", "khz"];
var RESOLUTION = ["dpi", "dpcm", "dppx", "x"];
var FLEX = ["fr"];
var DECIBEL = ["db"];
var SEMITONES = ["st"];
function charCodeAt(str, index) {
  return index < str.length ? str.charCodeAt(index) : 0;
}
function eqStr(actual, expected) {
  return cmpStr(actual, 0, actual.length, expected);
}
function eqStrAny(actual, expected) {
  for (let i = 0; i < expected.length; i++) {
    if (eqStr(actual, expected[i])) {
      return true;
    }
  }
  return false;
}
function isPostfixIeHack(str, offset) {
  if (offset !== str.length - 2) {
    return false;
  }
  return charCodeAt(str, offset) === 92 && isDigit(charCodeAt(str, offset + 1));
}
function outOfRange(opts, value, numEnd) {
  if (opts && opts.type === "Range") {
    const num = Number(numEnd !== void 0 && numEnd !== value.length ? value.substr(0, numEnd) : value);
    if (isNaN(num)) {
      return true;
    }
    if (opts.min !== null && num < opts.min) {
      return true;
    }
    if (opts.max !== null && num > opts.max) {
      return true;
    }
  }
  return false;
}
function consumeFunction(token, getNextToken) {
  let balanceCloseType = 0;
  let balanceStash = [];
  let length = 0;
  scan:
    do {
      switch (token.type) {
        case RightCurlyBracket:
        case RightParenthesis:
        case RightSquareBracket:
          if (token.type !== balanceCloseType) {
            break scan;
          }
          balanceCloseType = balanceStash.pop();
          if (balanceStash.length === 0) {
            length++;
            break scan;
          }
          break;
        case Function2:
        case LeftParenthesis:
        case LeftSquareBracket:
        case LeftCurlyBracket:
          balanceStash.push(balanceCloseType);
          balanceCloseType = balancePair2.get(token.type);
          break;
      }
      length++;
    } while (token = getNextToken(length));
  return length;
}
function calc(next) {
  return function(token, getNextToken, opts) {
    if (token === null) {
      return 0;
    }
    if (token.type === Function2 && eqStrAny(token.value, calcFunctionNames)) {
      return consumeFunction(token, getNextToken);
    }
    return next(token, getNextToken, opts);
  };
}
function tokenType(expectedTokenType) {
  return function(token) {
    if (token === null || token.type !== expectedTokenType) {
      return 0;
    }
    return 1;
  };
}
function func(name41) {
  name41 = name41 + "(";
  return function(token, getNextToken) {
    if (token !== null && eqStr(token.value, name41)) {
      return consumeFunction(token, getNextToken);
    }
    return 0;
  };
}
function customIdent(token) {
  if (token === null || token.type !== Ident) {
    return 0;
  }
  const name41 = token.value.toLowerCase();
  if (eqStrAny(name41, cssWideKeywords)) {
    return 0;
  }
  if (eqStr(name41, "default")) {
    return 0;
  }
  return 1;
}
function customPropertyName(token) {
  if (token === null || token.type !== Ident) {
    return 0;
  }
  if (charCodeAt(token.value, 0) !== 45 || charCodeAt(token.value, 1) !== 45) {
    return 0;
  }
  return 1;
}
function hexColor(token) {
  if (token === null || token.type !== Hash) {
    return 0;
  }
  const length = token.value.length;
  if (length !== 4 && length !== 5 && length !== 7 && length !== 9) {
    return 0;
  }
  for (let i = 1; i < length; i++) {
    if (!isHexDigit(charCodeAt(token.value, i))) {
      return 0;
    }
  }
  return 1;
}
function idSelector(token) {
  if (token === null || token.type !== Hash) {
    return 0;
  }
  if (!isIdentifierStart(charCodeAt(token.value, 1), charCodeAt(token.value, 2), charCodeAt(token.value, 3))) {
    return 0;
  }
  return 1;
}
function declarationValue(token, getNextToken) {
  if (!token) {
    return 0;
  }
  let balanceCloseType = 0;
  let balanceStash = [];
  let length = 0;
  scan:
    do {
      switch (token.type) {
        case BadString:
        case BadUrl:
          break scan;
        case RightCurlyBracket:
        case RightParenthesis:
        case RightSquareBracket:
          if (token.type !== balanceCloseType) {
            break scan;
          }
          balanceCloseType = balanceStash.pop();
          break;
        case Semicolon:
          if (balanceCloseType === 0) {
            break scan;
          }
          break;
        case Delim:
          if (balanceCloseType === 0 && token.value === "!") {
            break scan;
          }
          break;
        case Function2:
        case LeftParenthesis:
        case LeftSquareBracket:
        case LeftCurlyBracket:
          balanceStash.push(balanceCloseType);
          balanceCloseType = balancePair2.get(token.type);
          break;
      }
      length++;
    } while (token = getNextToken(length));
  return length;
}
function anyValue(token, getNextToken) {
  if (!token) {
    return 0;
  }
  let balanceCloseType = 0;
  let balanceStash = [];
  let length = 0;
  scan:
    do {
      switch (token.type) {
        case BadString:
        case BadUrl:
          break scan;
        case RightCurlyBracket:
        case RightParenthesis:
        case RightSquareBracket:
          if (token.type !== balanceCloseType) {
            break scan;
          }
          balanceCloseType = balanceStash.pop();
          break;
        case Function2:
        case LeftParenthesis:
        case LeftSquareBracket:
        case LeftCurlyBracket:
          balanceStash.push(balanceCloseType);
          balanceCloseType = balancePair2.get(token.type);
          break;
      }
      length++;
    } while (token = getNextToken(length));
  return length;
}
function dimension(type) {
  if (type) {
    type = new Set(type);
  }
  return function(token, getNextToken, opts) {
    if (token === null || token.type !== Dimension) {
      return 0;
    }
    const numberEnd = consumeNumber(token.value, 0);
    if (type !== null) {
      const reverseSolidusOffset = token.value.indexOf("\\", numberEnd);
      const unit = reverseSolidusOffset === -1 || !isPostfixIeHack(token.value, reverseSolidusOffset) ? token.value.substr(numberEnd) : token.value.substring(numberEnd, reverseSolidusOffset);
      if (type.has(unit.toLowerCase()) === false) {
        return 0;
      }
    }
    if (outOfRange(opts, token.value, numberEnd)) {
      return 0;
    }
    return 1;
  };
}
function percentage(token, getNextToken, opts) {
  if (token === null || token.type !== Percentage) {
    return 0;
  }
  if (outOfRange(opts, token.value, token.value.length - 1)) {
    return 0;
  }
  return 1;
}
function zero(next) {
  if (typeof next !== "function") {
    next = function() {
      return 0;
    };
  }
  return function(token, getNextToken, opts) {
    if (token !== null && token.type === Number2) {
      if (Number(token.value) === 0) {
        return 1;
      }
    }
    return next(token, getNextToken, opts);
  };
}
function number(token, getNextToken, opts) {
  if (token === null) {
    return 0;
  }
  const numberEnd = consumeNumber(token.value, 0);
  const isNumber = numberEnd === token.value.length;
  if (!isNumber && !isPostfixIeHack(token.value, numberEnd)) {
    return 0;
  }
  if (outOfRange(opts, token.value, numberEnd)) {
    return 0;
  }
  return 1;
}
function integer(token, getNextToken, opts) {
  if (token === null || token.type !== Number2) {
    return 0;
  }
  let i = charCodeAt(token.value, 0) === 43 || charCodeAt(token.value, 0) === 45 ? 1 : 0;
  for (; i < token.value.length; i++) {
    if (!isDigit(charCodeAt(token.value, i))) {
      return 0;
    }
  }
  if (outOfRange(opts, token.value, i)) {
    return 0;
  }
  return 1;
}
var generic_default = {
  "ident-token": tokenType(Ident),
  "function-token": tokenType(Function2),
  "at-keyword-token": tokenType(AtKeyword),
  "hash-token": tokenType(Hash),
  "string-token": tokenType(String2),
  "bad-string-token": tokenType(BadString),
  "url-token": tokenType(Url),
  "bad-url-token": tokenType(BadUrl),
  "delim-token": tokenType(Delim),
  "number-token": tokenType(Number2),
  "percentage-token": tokenType(Percentage),
  "dimension-token": tokenType(Dimension),
  "whitespace-token": tokenType(WhiteSpace),
  "CDO-token": tokenType(CDO),
  "CDC-token": tokenType(CDC),
  "colon-token": tokenType(Colon),
  "semicolon-token": tokenType(Semicolon),
  "comma-token": tokenType(Comma),
  "[-token": tokenType(LeftSquareBracket),
  "]-token": tokenType(RightSquareBracket),
  "(-token": tokenType(LeftParenthesis),
  ")-token": tokenType(RightParenthesis),
  "{-token": tokenType(LeftCurlyBracket),
  "}-token": tokenType(RightCurlyBracket),
  "string": tokenType(String2),
  "ident": tokenType(Ident),
  "custom-ident": customIdent,
  "custom-property-name": customPropertyName,
  "hex-color": hexColor,
  "id-selector": idSelector,
  "an-plus-b": anPlusB,
  "urange": urange,
  "declaration-value": declarationValue,
  "any-value": anyValue,
  "dimension": calc(dimension(null)),
  "angle": calc(dimension(ANGLE)),
  "decibel": calc(dimension(DECIBEL)),
  "frequency": calc(dimension(FREQUENCY)),
  "flex": calc(dimension(FLEX)),
  "length": calc(zero(dimension(LENGTH))),
  "resolution": calc(dimension(RESOLUTION)),
  "semitones": calc(dimension(SEMITONES)),
  "time": calc(dimension(TIME)),
  "percentage": calc(percentage),
  "zero": zero(),
  "number": calc(number),
  "integer": calc(integer),
  "-ms-legacy-expression": func("expression")
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/definition-syntax/SyntaxError.js
function SyntaxError3(message, input, offset) {
  return Object.assign(createCustomError("SyntaxError", message), {
    input,
    offset,
    rawMessage: message,
    message: message + "\n  " + input + "\n--" + new Array((offset || input.length) + 1).join("-") + "^"
  });
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/definition-syntax/tokenizer.js
var TAB = 9;
var N3 = 10;
var F2 = 12;
var R2 = 13;
var SPACE = 32;
var Tokenizer = class {
  constructor(str) {
    this.str = str;
    this.pos = 0;
  }
  charCodeAt(pos) {
    return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
  }
  charCode() {
    return this.charCodeAt(this.pos);
  }
  nextCharCode() {
    return this.charCodeAt(this.pos + 1);
  }
  nextNonWsCode(pos) {
    return this.charCodeAt(this.findWsEnd(pos));
  }
  findWsEnd(pos) {
    for (; pos < this.str.length; pos++) {
      const code2 = this.str.charCodeAt(pos);
      if (code2 !== R2 && code2 !== N3 && code2 !== F2 && code2 !== SPACE && code2 !== TAB) {
        break;
      }
    }
    return pos;
  }
  substringToPos(end) {
    return this.str.substring(this.pos, this.pos = end);
  }
  eat(code2) {
    if (this.charCode() !== code2) {
      this.error("Expect `" + String.fromCharCode(code2) + "`");
    }
    this.pos++;
  }
  peek() {
    return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
  }
  error(message) {
    throw new SyntaxError3(message, this.str, this.pos);
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/definition-syntax/parse.js
var TAB2 = 9;
var N4 = 10;
var F3 = 12;
var R3 = 13;
var SPACE2 = 32;
var EXCLAMATIONMARK2 = 33;
var NUMBERSIGN2 = 35;
var AMPERSAND = 38;
var APOSTROPHE = 39;
var LEFTPARENTHESIS = 40;
var RIGHTPARENTHESIS = 41;
var ASTERISK = 42;
var PLUSSIGN4 = 43;
var COMMA = 44;
var HYPERMINUS = 45;
var LESSTHANSIGN = 60;
var GREATERTHANSIGN = 62;
var QUESTIONMARK2 = 63;
var COMMERCIALAT = 64;
var LEFTSQUAREBRACKET = 91;
var RIGHTSQUAREBRACKET = 93;
var LEFTCURLYBRACKET2 = 123;
var VERTICALLINE = 124;
var RIGHTCURLYBRACKET = 125;
var INFINITY = 8734;
var NAME_CHAR = new Uint8Array(128).map((_, idx) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(idx)) ? 1 : 0);
var COMBINATOR_PRECEDENCE = {
  " ": 1,
  "&&": 2,
  "||": 3,
  "|": 4
};
function scanSpaces(tokenizer) {
  return tokenizer.substringToPos(tokenizer.findWsEnd(tokenizer.pos));
}
function scanWord(tokenizer) {
  let end = tokenizer.pos;
  for (; end < tokenizer.str.length; end++) {
    const code2 = tokenizer.str.charCodeAt(end);
    if (code2 >= 128 || NAME_CHAR[code2] === 0) {
      break;
    }
  }
  if (tokenizer.pos === end) {
    tokenizer.error("Expect a keyword");
  }
  return tokenizer.substringToPos(end);
}
function scanNumber(tokenizer) {
  let end = tokenizer.pos;
  for (; end < tokenizer.str.length; end++) {
    const code2 = tokenizer.str.charCodeAt(end);
    if (code2 < 48 || code2 > 57) {
      break;
    }
  }
  if (tokenizer.pos === end) {
    tokenizer.error("Expect a number");
  }
  return tokenizer.substringToPos(end);
}
function scanString(tokenizer) {
  const end = tokenizer.str.indexOf("'", tokenizer.pos + 1);
  if (end === -1) {
    tokenizer.pos = tokenizer.str.length;
    tokenizer.error("Expect an apostrophe");
  }
  return tokenizer.substringToPos(end + 1);
}
function readMultiplierRange(tokenizer) {
  let min = null;
  let max = null;
  tokenizer.eat(LEFTCURLYBRACKET2);
  min = scanNumber(tokenizer);
  if (tokenizer.charCode() === COMMA) {
    tokenizer.pos++;
    if (tokenizer.charCode() !== RIGHTCURLYBRACKET) {
      max = scanNumber(tokenizer);
    }
  } else {
    max = min;
  }
  tokenizer.eat(RIGHTCURLYBRACKET);
  return {
    min: Number(min),
    max: max ? Number(max) : 0
  };
}
function readMultiplier(tokenizer) {
  let range = null;
  let comma = false;
  switch (tokenizer.charCode()) {
    case ASTERISK:
      tokenizer.pos++;
      range = {
        min: 0,
        max: 0
      };
      break;
    case PLUSSIGN4:
      tokenizer.pos++;
      range = {
        min: 1,
        max: 0
      };
      break;
    case QUESTIONMARK2:
      tokenizer.pos++;
      range = {
        min: 0,
        max: 1
      };
      break;
    case NUMBERSIGN2:
      tokenizer.pos++;
      comma = true;
      if (tokenizer.charCode() === LEFTCURLYBRACKET2) {
        range = readMultiplierRange(tokenizer);
      } else {
        range = {
          min: 1,
          max: 0
        };
      }
      break;
    case LEFTCURLYBRACKET2:
      range = readMultiplierRange(tokenizer);
      break;
    default:
      return null;
  }
  return {
    type: "Multiplier",
    comma,
    min: range.min,
    max: range.max,
    term: null
  };
}
function maybeMultiplied(tokenizer, node) {
  const multiplier = readMultiplier(tokenizer);
  if (multiplier !== null) {
    multiplier.term = node;
    return multiplier;
  }
  return node;
}
function maybeToken(tokenizer) {
  const ch = tokenizer.peek();
  if (ch === "") {
    return null;
  }
  return {
    type: "Token",
    value: ch
  };
}
function readProperty(tokenizer) {
  let name41;
  tokenizer.eat(LESSTHANSIGN);
  tokenizer.eat(APOSTROPHE);
  name41 = scanWord(tokenizer);
  tokenizer.eat(APOSTROPHE);
  tokenizer.eat(GREATERTHANSIGN);
  return maybeMultiplied(tokenizer, {
    type: "Property",
    name: name41
  });
}
function readTypeRange(tokenizer) {
  let min = null;
  let max = null;
  let sign = 1;
  tokenizer.eat(LEFTSQUAREBRACKET);
  if (tokenizer.charCode() === HYPERMINUS) {
    tokenizer.peek();
    sign = -1;
  }
  if (sign == -1 && tokenizer.charCode() === INFINITY) {
    tokenizer.peek();
  } else {
    min = sign * Number(scanNumber(tokenizer));
  }
  scanSpaces(tokenizer);
  tokenizer.eat(COMMA);
  scanSpaces(tokenizer);
  if (tokenizer.charCode() === INFINITY) {
    tokenizer.peek();
  } else {
    sign = 1;
    if (tokenizer.charCode() === HYPERMINUS) {
      tokenizer.peek();
      sign = -1;
    }
    max = sign * Number(scanNumber(tokenizer));
  }
  tokenizer.eat(RIGHTSQUAREBRACKET);
  if (min === null && max === null) {
    return null;
  }
  return {
    type: "Range",
    min,
    max
  };
}
function readType(tokenizer) {
  let name41;
  let opts = null;
  tokenizer.eat(LESSTHANSIGN);
  name41 = scanWord(tokenizer);
  if (tokenizer.charCode() === LEFTPARENTHESIS && tokenizer.nextCharCode() === RIGHTPARENTHESIS) {
    tokenizer.pos += 2;
    name41 += "()";
  }
  if (tokenizer.charCodeAt(tokenizer.findWsEnd(tokenizer.pos)) === LEFTSQUAREBRACKET) {
    scanSpaces(tokenizer);
    opts = readTypeRange(tokenizer);
  }
  tokenizer.eat(GREATERTHANSIGN);
  return maybeMultiplied(tokenizer, {
    type: "Type",
    name: name41,
    opts
  });
}
function readKeywordOrFunction(tokenizer) {
  const name41 = scanWord(tokenizer);
  if (tokenizer.charCode() === LEFTPARENTHESIS) {
    tokenizer.pos++;
    return {
      type: "Function",
      name: name41
    };
  }
  return maybeMultiplied(tokenizer, {
    type: "Keyword",
    name: name41
  });
}
function regroupTerms(terms, combinators) {
  function createGroup(terms2, combinator2) {
    return {
      type: "Group",
      terms: terms2,
      combinator: combinator2,
      disallowEmpty: false,
      explicit: false
    };
  }
  let combinator;
  combinators = Object.keys(combinators).sort((a, b) => COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b]);
  while (combinators.length > 0) {
    combinator = combinators.shift();
    let i = 0;
    let subgroupStart = 0;
    for (; i < terms.length; i++) {
      const term = terms[i];
      if (term.type === "Combinator") {
        if (term.value === combinator) {
          if (subgroupStart === -1) {
            subgroupStart = i - 1;
          }
          terms.splice(i, 1);
          i--;
        } else {
          if (subgroupStart !== -1 && i - subgroupStart > 1) {
            terms.splice(subgroupStart, i - subgroupStart, createGroup(terms.slice(subgroupStart, i), combinator));
            i = subgroupStart + 1;
          }
          subgroupStart = -1;
        }
      }
    }
    if (subgroupStart !== -1 && combinators.length) {
      terms.splice(subgroupStart, i - subgroupStart, createGroup(terms.slice(subgroupStart, i), combinator));
    }
  }
  return combinator;
}
function readImplicitGroup(tokenizer) {
  const terms = [];
  const combinators = {};
  let token;
  let prevToken = null;
  let prevTokenPos = tokenizer.pos;
  while (token = peek(tokenizer)) {
    if (token.type !== "Spaces") {
      if (token.type === "Combinator") {
        if (prevToken === null || prevToken.type === "Combinator") {
          tokenizer.pos = prevTokenPos;
          tokenizer.error("Unexpected combinator");
        }
        combinators[token.value] = true;
      } else if (prevToken !== null && prevToken.type !== "Combinator") {
        combinators[" "] = true;
        terms.push({
          type: "Combinator",
          value: " "
        });
      }
      terms.push(token);
      prevToken = token;
      prevTokenPos = tokenizer.pos;
    }
  }
  if (prevToken !== null && prevToken.type === "Combinator") {
    tokenizer.pos -= prevTokenPos;
    tokenizer.error("Unexpected combinator");
  }
  return {
    type: "Group",
    terms,
    combinator: regroupTerms(terms, combinators) || " ",
    disallowEmpty: false,
    explicit: false
  };
}
function readGroup(tokenizer) {
  let result;
  tokenizer.eat(LEFTSQUAREBRACKET);
  result = readImplicitGroup(tokenizer);
  tokenizer.eat(RIGHTSQUAREBRACKET);
  result.explicit = true;
  if (tokenizer.charCode() === EXCLAMATIONMARK2) {
    tokenizer.pos++;
    result.disallowEmpty = true;
  }
  return result;
}
function peek(tokenizer) {
  let code2 = tokenizer.charCode();
  if (code2 < 128 && NAME_CHAR[code2] === 1) {
    return readKeywordOrFunction(tokenizer);
  }
  switch (code2) {
    case RIGHTSQUAREBRACKET:
      break;
    case LEFTSQUAREBRACKET:
      return maybeMultiplied(tokenizer, readGroup(tokenizer));
    case LESSTHANSIGN:
      return tokenizer.nextCharCode() === APOSTROPHE ? readProperty(tokenizer) : readType(tokenizer);
    case VERTICALLINE:
      return {
        type: "Combinator",
        value: tokenizer.substringToPos(tokenizer.pos + (tokenizer.nextCharCode() === VERTICALLINE ? 2 : 1))
      };
    case AMPERSAND:
      tokenizer.pos++;
      tokenizer.eat(AMPERSAND);
      return {
        type: "Combinator",
        value: "&&"
      };
    case COMMA:
      tokenizer.pos++;
      return {
        type: "Comma"
      };
    case APOSTROPHE:
      return maybeMultiplied(tokenizer, {
        type: "String",
        value: scanString(tokenizer)
      });
    case SPACE2:
    case TAB2:
    case N4:
    case R3:
    case F3:
      return {
        type: "Spaces",
        value: scanSpaces(tokenizer)
      };
    case COMMERCIALAT:
      code2 = tokenizer.nextCharCode();
      if (code2 < 128 && NAME_CHAR[code2] === 1) {
        tokenizer.pos++;
        return {
          type: "AtKeyword",
          name: scanWord(tokenizer)
        };
      }
      return maybeToken(tokenizer);
    case ASTERISK:
    case PLUSSIGN4:
    case QUESTIONMARK2:
    case NUMBERSIGN2:
    case EXCLAMATIONMARK2:
      break;
    case LEFTCURLYBRACKET2:
      code2 = tokenizer.nextCharCode();
      if (code2 < 48 || code2 > 57) {
        return maybeToken(tokenizer);
      }
      break;
    default:
      return maybeToken(tokenizer);
  }
}
function parse(source) {
  const tokenizer = new Tokenizer(source);
  const result = readImplicitGroup(tokenizer);
  if (tokenizer.pos !== source.length) {
    tokenizer.error("Unexpected input");
  }
  if (result.terms.length === 1 && result.terms[0].type === "Group") {
    return result.terms[0];
  }
  return result;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/definition-syntax/walk.js
var noop3 = function() {
};
function ensureFunction2(value) {
  return typeof value === "function" ? value : noop3;
}
function walk(node, options, context) {
  function walk3(node2) {
    enter.call(context, node2);
    switch (node2.type) {
      case "Group":
        node2.terms.forEach(walk3);
        break;
      case "Multiplier":
        walk3(node2.term);
        break;
      case "Type":
      case "Property":
      case "Keyword":
      case "AtKeyword":
      case "Function":
      case "String":
      case "Token":
      case "Comma":
        break;
      default:
        throw new Error("Unknown type: " + node2.type);
    }
    leave.call(context, node2);
  }
  let enter = noop3;
  let leave = noop3;
  if (typeof options === "function") {
    enter = options;
  } else if (options) {
    enter = ensureFunction2(options.enter);
    leave = ensureFunction2(options.leave);
  }
  if (enter === noop3 && leave === noop3) {
    throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
  }
  walk3(node, context);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/prepare-tokens.js
var astToTokens = {
  decorator: function(handlers) {
    const tokens = [];
    let curNode = null;
    return {
      ...handlers,
      node(node) {
        const tmp2 = curNode;
        curNode = node;
        handlers.node.call(this, node);
        curNode = tmp2;
      },
      emit(value, type, auto) {
        tokens.push({
          type,
          value,
          node: auto ? null : curNode
        });
      },
      result() {
        return tokens;
      }
    };
  }
};
function stringToTokens(str) {
  const tokens = [];
  tokenize(str, (type, start, end) => tokens.push({
    type,
    value: str.slice(start, end),
    node: null
  }));
  return tokens;
}
function prepare_tokens_default(value, syntax) {
  if (typeof value === "string") {
    return stringToTokens(value);
  }
  return syntax.generate(value, astToTokens);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/match-graph.js
var MATCH = { type: "Match" };
var MISMATCH = { type: "Mismatch" };
var DISALLOW_EMPTY = { type: "DisallowEmpty" };
var LEFTPARENTHESIS2 = 40;
var RIGHTPARENTHESIS2 = 41;
function createCondition(match, thenBranch, elseBranch) {
  if (thenBranch === MATCH && elseBranch === MISMATCH) {
    return match;
  }
  if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
    return match;
  }
  if (match.type === "If" && match.else === MISMATCH && thenBranch === MATCH) {
    thenBranch = match.then;
    match = match.match;
  }
  return {
    type: "If",
    match,
    then: thenBranch,
    else: elseBranch
  };
}
function isFunctionType(name41) {
  return name41.length > 2 && name41.charCodeAt(name41.length - 2) === LEFTPARENTHESIS2 && name41.charCodeAt(name41.length - 1) === RIGHTPARENTHESIS2;
}
function isEnumCapatible(term) {
  return term.type === "Keyword" || term.type === "AtKeyword" || term.type === "Function" || term.type === "Type" && isFunctionType(term.name);
}
function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
  switch (combinator) {
    case " ": {
      let result = MATCH;
      for (let i = terms.length - 1; i >= 0; i--) {
        const term = terms[i];
        result = createCondition(term, result, MISMATCH);
      }
      ;
      return result;
    }
    case "|": {
      let result = MISMATCH;
      let map = null;
      for (let i = terms.length - 1; i >= 0; i--) {
        let term = terms[i];
        if (isEnumCapatible(term)) {
          if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
            map = /* @__PURE__ */ Object.create(null);
            result = createCondition({
              type: "Enum",
              map
            }, MATCH, result);
          }
          if (map !== null) {
            const key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
            if (key in map === false) {
              map[key] = term;
              continue;
            }
          }
        }
        map = null;
        result = createCondition(term, MATCH, result);
      }
      ;
      return result;
    }
    case "&&": {
      if (terms.length > 5) {
        return {
          type: "MatchOnce",
          terms,
          all: true
        };
      }
      let result = MISMATCH;
      for (let i = terms.length - 1; i >= 0; i--) {
        const term = terms[i];
        let thenClause;
        if (terms.length > 1) {
          thenClause = buildGroupMatchGraph(combinator, terms.filter(function(newGroupTerm) {
            return newGroupTerm !== term;
          }), false);
        } else {
          thenClause = MATCH;
        }
        result = createCondition(term, thenClause, result);
      }
      ;
      return result;
    }
    case "||": {
      if (terms.length > 5) {
        return {
          type: "MatchOnce",
          terms,
          all: false
        };
      }
      let result = atLeastOneTermMatched ? MATCH : MISMATCH;
      for (let i = terms.length - 1; i >= 0; i--) {
        const term = terms[i];
        let thenClause;
        if (terms.length > 1) {
          thenClause = buildGroupMatchGraph(combinator, terms.filter(function(newGroupTerm) {
            return newGroupTerm !== term;
          }), true);
        } else {
          thenClause = MATCH;
        }
        result = createCondition(term, thenClause, result);
      }
      ;
      return result;
    }
  }
}
function buildMultiplierMatchGraph(node) {
  let result = MATCH;
  let matchTerm = buildMatchGraphInternal(node.term);
  if (node.max === 0) {
    matchTerm = createCondition(matchTerm, DISALLOW_EMPTY, MISMATCH);
    result = createCondition(matchTerm, null, MISMATCH);
    result.then = createCondition(MATCH, MATCH, result);
    if (node.comma) {
      result.then.else = createCondition({ type: "Comma", syntax: node }, result, MISMATCH);
    }
  } else {
    for (let i = node.min || 1; i <= node.max; i++) {
      if (node.comma && result !== MATCH) {
        result = createCondition({ type: "Comma", syntax: node }, result, MISMATCH);
      }
      result = createCondition(matchTerm, createCondition(MATCH, MATCH, result), MISMATCH);
    }
  }
  if (node.min === 0) {
    result = createCondition(MATCH, MATCH, result);
  } else {
    for (let i = 0; i < node.min - 1; i++) {
      if (node.comma && result !== MATCH) {
        result = createCondition({ type: "Comma", syntax: node }, result, MISMATCH);
      }
      result = createCondition(matchTerm, result, MISMATCH);
    }
  }
  return result;
}
function buildMatchGraphInternal(node) {
  if (typeof node === "function") {
    return {
      type: "Generic",
      fn: node
    };
  }
  switch (node.type) {
    case "Group": {
      let result = buildGroupMatchGraph(node.combinator, node.terms.map(buildMatchGraphInternal), false);
      if (node.disallowEmpty) {
        result = createCondition(result, DISALLOW_EMPTY, MISMATCH);
      }
      return result;
    }
    case "Multiplier":
      return buildMultiplierMatchGraph(node);
    case "Type":
    case "Property":
      return {
        type: node.type,
        name: node.name,
        syntax: node
      };
    case "Keyword":
      return {
        type: node.type,
        name: node.name.toLowerCase(),
        syntax: node
      };
    case "AtKeyword":
      return {
        type: node.type,
        name: "@" + node.name.toLowerCase(),
        syntax: node
      };
    case "Function":
      return {
        type: node.type,
        name: node.name.toLowerCase() + "(",
        syntax: node
      };
    case "String":
      if (node.value.length === 3) {
        return {
          type: "Token",
          value: node.value.charAt(1),
          syntax: node
        };
      }
      return {
        type: node.type,
        value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, "'"),
        syntax: node
      };
    case "Token":
      return {
        type: node.type,
        value: node.value,
        syntax: node
      };
    case "Comma":
      return {
        type: node.type,
        syntax: node
      };
    default:
      throw new Error("Unknown node type:", node.type);
  }
}
function buildMatchGraph(syntaxTree, ref) {
  if (typeof syntaxTree === "string") {
    syntaxTree = parse(syntaxTree);
  }
  return {
    type: "MatchGraph",
    match: buildMatchGraphInternal(syntaxTree),
    syntax: ref || null,
    source: syntaxTree
  };
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/match.js
var { hasOwnProperty: hasOwnProperty3 } = Object.prototype;
var STUB = 0;
var TOKEN = 1;
var OPEN_SYNTAX = 2;
var CLOSE_SYNTAX = 3;
var EXIT_REASON_MATCH = "Match";
var EXIT_REASON_MISMATCH = "Mismatch";
var EXIT_REASON_ITERATION_LIMIT = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)";
var ITERATION_LIMIT = 15e3;
var totalIterationCount = 0;
function reverseList(list) {
  let prev = null;
  let next = null;
  let item = list;
  while (item !== null) {
    next = item.prev;
    item.prev = prev;
    prev = item;
    item = next;
  }
  return prev;
}
function areStringsEqualCaseInsensitive(testStr, referenceStr) {
  if (testStr.length !== referenceStr.length) {
    return false;
  }
  for (let i = 0; i < testStr.length; i++) {
    const referenceCode = referenceStr.charCodeAt(i);
    let testCode = testStr.charCodeAt(i);
    if (testCode >= 65 && testCode <= 90) {
      testCode = testCode | 32;
    }
    if (testCode !== referenceCode) {
      return false;
    }
  }
  return true;
}
function isContextEdgeDelim(token) {
  if (token.type !== Delim) {
    return false;
  }
  return token.value !== "?";
}
function isCommaContextStart(token) {
  if (token === null) {
    return true;
  }
  return token.type === Comma || token.type === Function2 || token.type === LeftParenthesis || token.type === LeftSquareBracket || token.type === LeftCurlyBracket || isContextEdgeDelim(token);
}
function isCommaContextEnd(token) {
  if (token === null) {
    return true;
  }
  return token.type === RightParenthesis || token.type === RightSquareBracket || token.type === RightCurlyBracket || token.type === Delim;
}
function internalMatch(tokens, state, syntaxes) {
  function moveToNextToken() {
    do {
      tokenIndex++;
      token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
    } while (token !== null && (token.type === WhiteSpace || token.type === Comment));
  }
  function getNextToken(offset) {
    const nextIndex = tokenIndex + offset;
    return nextIndex < tokens.length ? tokens[nextIndex] : null;
  }
  function stateSnapshotFromSyntax(nextState, prev) {
    return {
      nextState,
      matchStack,
      syntaxStack,
      thenStack,
      tokenIndex,
      prev
    };
  }
  function pushThenStack(nextState) {
    thenStack = {
      nextState,
      matchStack,
      syntaxStack,
      prev: thenStack
    };
  }
  function pushElseStack(nextState) {
    elseStack = stateSnapshotFromSyntax(nextState, elseStack);
  }
  function addTokenToMatch() {
    matchStack = {
      type: TOKEN,
      syntax: state.syntax,
      token,
      prev: matchStack
    };
    moveToNextToken();
    syntaxStash = null;
    if (tokenIndex > longestMatch) {
      longestMatch = tokenIndex;
    }
  }
  function openSyntax() {
    syntaxStack = {
      syntax: state.syntax,
      opts: state.syntax.opts || syntaxStack !== null && syntaxStack.opts || null,
      prev: syntaxStack
    };
    matchStack = {
      type: OPEN_SYNTAX,
      syntax: state.syntax,
      token: matchStack.token,
      prev: matchStack
    };
  }
  function closeSyntax() {
    if (matchStack.type === OPEN_SYNTAX) {
      matchStack = matchStack.prev;
    } else {
      matchStack = {
        type: CLOSE_SYNTAX,
        syntax: syntaxStack.syntax,
        token: matchStack.token,
        prev: matchStack
      };
    }
    syntaxStack = syntaxStack.prev;
  }
  let syntaxStack = null;
  let thenStack = null;
  let elseStack = null;
  let syntaxStash = null;
  let iterationCount = 0;
  let exitReason = null;
  let token = null;
  let tokenIndex = -1;
  let longestMatch = 0;
  let matchStack = {
    type: STUB,
    syntax: null,
    token: null,
    prev: null
  };
  moveToNextToken();
  while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
    switch (state.type) {
      case "Match":
        if (thenStack === null) {
          if (token !== null) {
            if (tokenIndex !== tokens.length - 1 || token.value !== "\\0" && token.value !== "\\9") {
              state = MISMATCH;
              break;
            }
          }
          exitReason = EXIT_REASON_MATCH;
          break;
        }
        state = thenStack.nextState;
        if (state === DISALLOW_EMPTY) {
          if (thenStack.matchStack === matchStack) {
            state = MISMATCH;
            break;
          } else {
            state = MATCH;
          }
        }
        while (thenStack.syntaxStack !== syntaxStack) {
          closeSyntax();
        }
        thenStack = thenStack.prev;
        break;
      case "Mismatch":
        if (syntaxStash !== null && syntaxStash !== false) {
          if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
            elseStack = syntaxStash;
            syntaxStash = false;
          }
        } else if (elseStack === null) {
          exitReason = EXIT_REASON_MISMATCH;
          break;
        }
        state = elseStack.nextState;
        thenStack = elseStack.thenStack;
        syntaxStack = elseStack.syntaxStack;
        matchStack = elseStack.matchStack;
        tokenIndex = elseStack.tokenIndex;
        token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
        elseStack = elseStack.prev;
        break;
      case "MatchGraph":
        state = state.match;
        break;
      case "If":
        if (state.else !== MISMATCH) {
          pushElseStack(state.else);
        }
        if (state.then !== MATCH) {
          pushThenStack(state.then);
        }
        state = state.match;
        break;
      case "MatchOnce":
        state = {
          type: "MatchOnceBuffer",
          syntax: state,
          index: 0,
          mask: 0
        };
        break;
      case "MatchOnceBuffer": {
        const terms = state.syntax.terms;
        if (state.index === terms.length) {
          if (state.mask === 0 || state.syntax.all) {
            state = MISMATCH;
            break;
          }
          state = MATCH;
          break;
        }
        if (state.mask === (1 << terms.length) - 1) {
          state = MATCH;
          break;
        }
        for (; state.index < terms.length; state.index++) {
          const matchFlag = 1 << state.index;
          if ((state.mask & matchFlag) === 0) {
            pushElseStack(state);
            pushThenStack({
              type: "AddMatchOnce",
              syntax: state.syntax,
              mask: state.mask | matchFlag
            });
            state = terms[state.index++];
            break;
          }
        }
        break;
      }
      case "AddMatchOnce":
        state = {
          type: "MatchOnceBuffer",
          syntax: state.syntax,
          index: 0,
          mask: state.mask
        };
        break;
      case "Enum":
        if (token !== null) {
          let name41 = token.value.toLowerCase();
          if (name41.indexOf("\\") !== -1) {
            name41 = name41.replace(/\\[09].*$/, "");
          }
          if (hasOwnProperty3.call(state.map, name41)) {
            state = state.map[name41];
            break;
          }
        }
        state = MISMATCH;
        break;
      case "Generic": {
        const opts = syntaxStack !== null ? syntaxStack.opts : null;
        const lastTokenIndex2 = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));
        if (!isNaN(lastTokenIndex2) && lastTokenIndex2 > tokenIndex) {
          while (tokenIndex < lastTokenIndex2) {
            addTokenToMatch();
          }
          state = MATCH;
        } else {
          state = MISMATCH;
        }
        break;
      }
      case "Type":
      case "Property": {
        const syntaxDict = state.type === "Type" ? "types" : "properties";
        const dictSyntax = hasOwnProperty3.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;
        if (!dictSyntax || !dictSyntax.match) {
          throw new Error("Bad syntax reference: " + (state.type === "Type" ? "<" + state.name + ">" : "<'" + state.name + "'>"));
        }
        if (syntaxStash !== false && token !== null && state.type === "Type") {
          const lowPriorityMatching = state.name === "custom-ident" && token.type === Ident || state.name === "length" && token.value === "0";
          if (lowPriorityMatching) {
            if (syntaxStash === null) {
              syntaxStash = stateSnapshotFromSyntax(state, elseStack);
            }
            state = MISMATCH;
            break;
          }
        }
        openSyntax();
        state = dictSyntax.match;
        break;
      }
      case "Keyword": {
        const name41 = state.name;
        if (token !== null) {
          let keywordName = token.value;
          if (keywordName.indexOf("\\") !== -1) {
            keywordName = keywordName.replace(/\\[09].*$/, "");
          }
          if (areStringsEqualCaseInsensitive(keywordName, name41)) {
            addTokenToMatch();
            state = MATCH;
            break;
          }
        }
        state = MISMATCH;
        break;
      }
      case "AtKeyword":
      case "Function":
        if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
          addTokenToMatch();
          state = MATCH;
          break;
        }
        state = MISMATCH;
        break;
      case "Token":
        if (token !== null && token.value === state.value) {
          addTokenToMatch();
          state = MATCH;
          break;
        }
        state = MISMATCH;
        break;
      case "Comma":
        if (token !== null && token.type === Comma) {
          if (isCommaContextStart(matchStack.token)) {
            state = MISMATCH;
          } else {
            addTokenToMatch();
            state = isCommaContextEnd(token) ? MISMATCH : MATCH;
          }
        } else {
          state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH : MISMATCH;
        }
        break;
      case "String":
        let string = "";
        let lastTokenIndex = tokenIndex;
        for (; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
          string += tokens[lastTokenIndex].value;
        }
        if (areStringsEqualCaseInsensitive(string, state.value)) {
          while (tokenIndex < lastTokenIndex) {
            addTokenToMatch();
          }
          state = MATCH;
        } else {
          state = MISMATCH;
        }
        break;
      default:
        throw new Error("Unknown node type: " + state.type);
    }
  }
  totalIterationCount += iterationCount;
  switch (exitReason) {
    case null:
      console.warn("[csstree-match] BREAK after " + ITERATION_LIMIT + " iterations");
      exitReason = EXIT_REASON_ITERATION_LIMIT;
      matchStack = null;
      break;
    case EXIT_REASON_MATCH:
      while (syntaxStack !== null) {
        closeSyntax();
      }
      break;
    default:
      matchStack = null;
  }
  return {
    tokens,
    reason: exitReason,
    iterations: iterationCount,
    match: matchStack,
    longestMatch
  };
}
function matchAsTree(tokens, matchGraph, syntaxes) {
  const matchResult = internalMatch(tokens, matchGraph, syntaxes || {});
  if (matchResult.match === null) {
    return matchResult;
  }
  let item = matchResult.match;
  let host = matchResult.match = {
    syntax: matchGraph.syntax || null,
    match: []
  };
  const hostStack = [host];
  item = reverseList(item).prev;
  while (item !== null) {
    switch (item.type) {
      case OPEN_SYNTAX:
        host.match.push(host = {
          syntax: item.syntax,
          match: []
        });
        hostStack.push(host);
        break;
      case CLOSE_SYNTAX:
        hostStack.pop();
        host = hostStack[hostStack.length - 1];
        break;
      default:
        host.match.push({
          syntax: item.syntax || null,
          token: item.token.value,
          node: item.token.node
        });
    }
    item = item.prev;
  }
  return matchResult;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/trace.js
var trace_exports = {};
__export(trace_exports, {
  getTrace: () => getTrace,
  isKeyword: () => isKeyword,
  isProperty: () => isProperty,
  isType: () => isType
});
function getTrace(node) {
  function shouldPutToTrace(syntax) {
    if (syntax === null) {
      return false;
    }
    return syntax.type === "Type" || syntax.type === "Property" || syntax.type === "Keyword";
  }
  function hasMatch(matchNode) {
    if (Array.isArray(matchNode.match)) {
      for (let i = 0; i < matchNode.match.length; i++) {
        if (hasMatch(matchNode.match[i])) {
          if (shouldPutToTrace(matchNode.syntax)) {
            result.unshift(matchNode.syntax);
          }
          return true;
        }
      }
    } else if (matchNode.node === node) {
      result = shouldPutToTrace(matchNode.syntax) ? [matchNode.syntax] : [];
      return true;
    }
    return false;
  }
  let result = null;
  if (this.matched !== null) {
    hasMatch(this.matched);
  }
  return result;
}
function isType(node, type) {
  return testNode(this, node, (match) => match.type === "Type" && match.name === type);
}
function isProperty(node, property2) {
  return testNode(this, node, (match) => match.type === "Property" && match.name === property2);
}
function isKeyword(node) {
  return testNode(this, node, (match) => match.type === "Keyword");
}
function testNode(match, node, fn) {
  const trace = getTrace.call(match, node);
  if (trace === null) {
    return false;
  }
  return trace.some(fn);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/search.js
function getFirstMatchNode(matchNode) {
  if ("node" in matchNode) {
    return matchNode.node;
  }
  return getFirstMatchNode(matchNode.match[0]);
}
function getLastMatchNode(matchNode) {
  if ("node" in matchNode) {
    return matchNode.node;
  }
  return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
}
function matchFragments(lexer2, ast, match, type, name41) {
  function findFragments(matchNode) {
    if (matchNode.syntax !== null && matchNode.syntax.type === type && matchNode.syntax.name === name41) {
      const start = getFirstMatchNode(matchNode);
      const end = getLastMatchNode(matchNode);
      lexer2.syntax.walk(ast, function(node, item, list) {
        if (node === start) {
          const nodes = new List();
          do {
            nodes.appendData(item.data);
            if (item.data === end) {
              break;
            }
            item = item.next;
          } while (item !== null);
          fragments.push({
            parent: list,
            nodes
          });
        }
      });
    }
    if (Array.isArray(matchNode.match)) {
      matchNode.match.forEach(findFragments);
    }
  }
  const fragments = [];
  if (match.matched !== null) {
    findFragments(match.matched);
  }
  return fragments;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/structure.js
var { hasOwnProperty: hasOwnProperty4 } = Object.prototype;
function isValidNumber(value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value && value >= 0;
}
function isValidLocation(loc) {
  return Boolean(loc) && isValidNumber(loc.offset) && isValidNumber(loc.line) && isValidNumber(loc.column);
}
function createNodeStructureChecker(type, fields) {
  return function checkNode(node, warn) {
    if (!node || node.constructor !== Object) {
      return warn(node, "Type of node should be an Object");
    }
    for (let key in node) {
      let valid = true;
      if (hasOwnProperty4.call(node, key) === false) {
        continue;
      }
      if (key === "type") {
        if (node.type !== type) {
          warn(node, "Wrong node type `" + node.type + "`, expected `" + type + "`");
        }
      } else if (key === "loc") {
        if (node.loc === null) {
          continue;
        } else if (node.loc && node.loc.constructor === Object) {
          if (typeof node.loc.source !== "string") {
            key += ".source";
          } else if (!isValidLocation(node.loc.start)) {
            key += ".start";
          } else if (!isValidLocation(node.loc.end)) {
            key += ".end";
          } else {
            continue;
          }
        }
        valid = false;
      } else if (fields.hasOwnProperty(key)) {
        valid = false;
        for (let i = 0; !valid && i < fields[key].length; i++) {
          const fieldType = fields[key][i];
          switch (fieldType) {
            case String:
              valid = typeof node[key] === "string";
              break;
            case Boolean:
              valid = typeof node[key] === "boolean";
              break;
            case null:
              valid = node[key] === null;
              break;
            default:
              if (typeof fieldType === "string") {
                valid = node[key] && node[key].type === fieldType;
              } else if (Array.isArray(fieldType)) {
                valid = node[key] instanceof List;
              }
          }
        }
      } else {
        warn(node, "Unknown field `" + key + "` for " + type + " node type");
      }
      if (!valid) {
        warn(node, "Bad value for `" + type + "." + key + "`");
      }
    }
    for (const key in fields) {
      if (hasOwnProperty4.call(fields, key) && hasOwnProperty4.call(node, key) === false) {
        warn(node, "Field `" + type + "." + key + "` is missed");
      }
    }
  };
}
function processStructure(name41, nodeType) {
  const structure41 = nodeType.structure;
  const fields = {
    type: String,
    loc: true
  };
  const docs = {
    type: '"' + name41 + '"'
  };
  for (const key in structure41) {
    if (hasOwnProperty4.call(structure41, key) === false) {
      continue;
    }
    const docsTypes = [];
    const fieldTypes = fields[key] = Array.isArray(structure41[key]) ? structure41[key].slice() : [structure41[key]];
    for (let i = 0; i < fieldTypes.length; i++) {
      const fieldType = fieldTypes[i];
      if (fieldType === String || fieldType === Boolean) {
        docsTypes.push(fieldType.name);
      } else if (fieldType === null) {
        docsTypes.push("null");
      } else if (typeof fieldType === "string") {
        docsTypes.push("<" + fieldType + ">");
      } else if (Array.isArray(fieldType)) {
        docsTypes.push("List");
      } else {
        throw new Error("Wrong value `" + fieldType + "` in `" + name41 + "." + key + "` structure definition");
      }
    }
    docs[key] = docsTypes.join(" | ");
  }
  return {
    docs,
    check: createNodeStructureChecker(name41, fields)
  };
}
function getStructureFromConfig(config) {
  const structure41 = {};
  if (config.node) {
    for (const name41 in config.node) {
      if (hasOwnProperty4.call(config.node, name41)) {
        const nodeType = config.node[name41];
        if (nodeType.structure) {
          structure41[name41] = processStructure(name41, nodeType);
        } else {
          throw new Error("Missed `structure` field in `" + name41 + "` node type definition");
        }
      }
    }
  }
  return structure41;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/lexer/Lexer.js
var cssWideKeywords2 = buildMatchGraph("inherit | initial | unset");
var cssWideKeywordsWithExpression = buildMatchGraph("inherit | initial | unset | <-ms-legacy-expression>");
function dumpMapSyntax(map, compact, syntaxAsAst) {
  const result = {};
  for (const name41 in map) {
    if (map[name41].syntax) {
      result[name41] = syntaxAsAst ? map[name41].syntax : generate(map[name41].syntax, { compact });
    }
  }
  return result;
}
function dumpAtruleMapSyntax(map, compact, syntaxAsAst) {
  const result = {};
  for (const [name41, atrule] of Object.entries(map)) {
    result[name41] = {
      prelude: atrule.prelude && (syntaxAsAst ? atrule.prelude.syntax : generate(atrule.prelude.syntax, { compact })),
      descriptors: atrule.descriptors && dumpMapSyntax(atrule.descriptors, compact, syntaxAsAst)
    };
  }
  return result;
}
function valueHasVar(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].value.toLowerCase() === "var(") {
      return true;
    }
  }
  return false;
}
function buildMatchResult(matched, error, iterations) {
  return {
    matched,
    iterations,
    error,
    ...trace_exports
  };
}
function matchSyntax(lexer2, syntax, value, useCommon) {
  const tokens = prepare_tokens_default(value, lexer2.syntax);
  let result;
  if (valueHasVar(tokens)) {
    return buildMatchResult(null, new Error("Matching for a tree with var() is not supported"));
  }
  if (useCommon) {
    result = matchAsTree(tokens, lexer2.valueCommonSyntax, lexer2);
  }
  if (!useCommon || !result.match) {
    result = matchAsTree(tokens, syntax.match, lexer2);
    if (!result.match) {
      return buildMatchResult(null, new SyntaxMatchError(result.reason, syntax.syntax, value, result), result.iterations);
    }
  }
  return buildMatchResult(result.match, null, result.iterations);
}
var Lexer = class {
  constructor(config, syntax, structure41) {
    this.valueCommonSyntax = cssWideKeywords2;
    this.syntax = syntax;
    this.generic = false;
    this.atrules = /* @__PURE__ */ Object.create(null);
    this.properties = /* @__PURE__ */ Object.create(null);
    this.types = /* @__PURE__ */ Object.create(null);
    this.structure = structure41 || getStructureFromConfig(config);
    if (config) {
      if (config.types) {
        for (const name41 in config.types) {
          this.addType_(name41, config.types[name41]);
        }
      }
      if (config.generic) {
        this.generic = true;
        for (const name41 in generic_default) {
          this.addType_(name41, generic_default[name41]);
        }
      }
      if (config.atrules) {
        for (const name41 in config.atrules) {
          this.addAtrule_(name41, config.atrules[name41]);
        }
      }
      if (config.properties) {
        for (const name41 in config.properties) {
          this.addProperty_(name41, config.properties[name41]);
        }
      }
    }
  }
  checkStructure(ast) {
    function collectWarning(node, message) {
      warns.push({ node, message });
    }
    const structure41 = this.structure;
    const warns = [];
    this.syntax.walk(ast, function(node) {
      if (structure41.hasOwnProperty(node.type)) {
        structure41[node.type].check(node, collectWarning);
      } else {
        collectWarning(node, "Unknown node type `" + node.type + "`");
      }
    });
    return warns.length ? warns : false;
  }
  createDescriptor(syntax, type, name41, parent = null) {
    const ref = {
      type,
      name: name41
    };
    const descriptor = {
      type,
      name: name41,
      parent,
      serializable: typeof syntax === "string" || syntax && typeof syntax.type === "string",
      syntax: null,
      match: null
    };
    if (typeof syntax === "function") {
      descriptor.match = buildMatchGraph(syntax, ref);
    } else {
      if (typeof syntax === "string") {
        Object.defineProperty(descriptor, "syntax", {
          get() {
            Object.defineProperty(descriptor, "syntax", {
              value: parse(syntax)
            });
            return descriptor.syntax;
          }
        });
      } else {
        descriptor.syntax = syntax;
      }
      Object.defineProperty(descriptor, "match", {
        get() {
          Object.defineProperty(descriptor, "match", {
            value: buildMatchGraph(descriptor.syntax, ref)
          });
          return descriptor.match;
        }
      });
    }
    return descriptor;
  }
  addAtrule_(name41, syntax) {
    if (!syntax) {
      return;
    }
    this.atrules[name41] = {
      type: "Atrule",
      name: name41,
      prelude: syntax.prelude ? this.createDescriptor(syntax.prelude, "AtrulePrelude", name41) : null,
      descriptors: syntax.descriptors ? Object.keys(syntax.descriptors).reduce((map, descName) => {
        map[descName] = this.createDescriptor(syntax.descriptors[descName], "AtruleDescriptor", descName, name41);
        return map;
      }, /* @__PURE__ */ Object.create(null)) : null
    };
  }
  addProperty_(name41, syntax) {
    if (!syntax) {
      return;
    }
    this.properties[name41] = this.createDescriptor(syntax, "Property", name41);
  }
  addType_(name41, syntax) {
    if (!syntax) {
      return;
    }
    this.types[name41] = this.createDescriptor(syntax, "Type", name41);
    if (syntax === generic_default["-ms-legacy-expression"]) {
      this.valueCommonSyntax = cssWideKeywordsWithExpression;
    }
  }
  checkAtruleName(atruleName) {
    if (!this.getAtrule(atruleName)) {
      return new SyntaxReferenceError("Unknown at-rule", "@" + atruleName);
    }
  }
  checkAtrulePrelude(atruleName, prelude) {
    const error = this.checkAtruleName(atruleName);
    if (error) {
      return error;
    }
    const atrule = this.getAtrule(atruleName);
    if (!atrule.prelude && prelude) {
      return new SyntaxError("At-rule `@" + atruleName + "` should not contain a prelude");
    }
    if (atrule.prelude && !prelude) {
      return new SyntaxError("At-rule `@" + atruleName + "` should contain a prelude");
    }
  }
  checkAtruleDescriptorName(atruleName, descriptorName) {
    const error = this.checkAtruleName(atruleName);
    if (error) {
      return error;
    }
    const atrule = this.getAtrule(atruleName);
    const descriptor = keyword(descriptorName);
    if (!atrule.descriptors) {
      return new SyntaxError("At-rule `@" + atruleName + "` has no known descriptors");
    }
    if (!atrule.descriptors[descriptor.name] && !atrule.descriptors[descriptor.basename]) {
      return new SyntaxReferenceError("Unknown at-rule descriptor", descriptorName);
    }
  }
  checkPropertyName(propertyName) {
    if (!this.getProperty(propertyName)) {
      return new SyntaxReferenceError("Unknown property", propertyName);
    }
  }
  matchAtrulePrelude(atruleName, prelude) {
    const error = this.checkAtrulePrelude(atruleName, prelude);
    if (error) {
      return buildMatchResult(null, error);
    }
    if (!prelude) {
      return buildMatchResult(null, null);
    }
    return matchSyntax(this, this.getAtrule(atruleName).prelude, prelude, false);
  }
  matchAtruleDescriptor(atruleName, descriptorName, value) {
    const error = this.checkAtruleDescriptorName(atruleName, descriptorName);
    if (error) {
      return buildMatchResult(null, error);
    }
    const atrule = this.getAtrule(atruleName);
    const descriptor = keyword(descriptorName);
    return matchSyntax(this, atrule.descriptors[descriptor.name] || atrule.descriptors[descriptor.basename], value, false);
  }
  matchDeclaration(node) {
    if (node.type !== "Declaration") {
      return buildMatchResult(null, new Error("Not a Declaration node"));
    }
    return this.matchProperty(node.property, node.value);
  }
  matchProperty(propertyName, value) {
    if (property(propertyName).custom) {
      return buildMatchResult(null, new Error("Lexer matching doesn't applicable for custom properties"));
    }
    const error = this.checkPropertyName(propertyName);
    if (error) {
      return buildMatchResult(null, error);
    }
    return matchSyntax(this, this.getProperty(propertyName), value, true);
  }
  matchType(typeName, value) {
    const typeSyntax = this.getType(typeName);
    if (!typeSyntax) {
      return buildMatchResult(null, new SyntaxReferenceError("Unknown type", typeName));
    }
    return matchSyntax(this, typeSyntax, value, false);
  }
  match(syntax, value) {
    if (typeof syntax !== "string" && (!syntax || !syntax.type)) {
      return buildMatchResult(null, new SyntaxReferenceError("Bad syntax"));
    }
    if (typeof syntax === "string" || !syntax.match) {
      syntax = this.createDescriptor(syntax, "Type", "anonymous");
    }
    return matchSyntax(this, syntax, value, false);
  }
  findValueFragments(propertyName, value, type, name41) {
    return matchFragments(this, value, this.matchProperty(propertyName, value), type, name41);
  }
  findDeclarationValueFragments(declaration, type, name41) {
    return matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name41);
  }
  findAllFragments(ast, type, name41) {
    const result = [];
    this.syntax.walk(ast, {
      visit: "Declaration",
      enter: (declaration) => {
        result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name41));
      }
    });
    return result;
  }
  getAtrule(atruleName, fallbackBasename = true) {
    const atrule = keyword(atruleName);
    const atruleEntry = atrule.vendor && fallbackBasename ? this.atrules[atrule.name] || this.atrules[atrule.basename] : this.atrules[atrule.name];
    return atruleEntry || null;
  }
  getAtrulePrelude(atruleName, fallbackBasename = true) {
    const atrule = this.getAtrule(atruleName, fallbackBasename);
    return atrule && atrule.prelude || null;
  }
  getAtruleDescriptor(atruleName, name41) {
    return this.atrules.hasOwnProperty(atruleName) && this.atrules.declarators ? this.atrules[atruleName].declarators[name41] || null : null;
  }
  getProperty(propertyName, fallbackBasename = true) {
    const property2 = property(propertyName);
    const propertyEntry = property2.vendor && fallbackBasename ? this.properties[property2.name] || this.properties[property2.basename] : this.properties[property2.name];
    return propertyEntry || null;
  }
  getType(name41) {
    return hasOwnProperty.call(this.types, name41) ? this.types[name41] : null;
  }
  validate() {
    function validate(syntax, name41, broken, descriptor) {
      if (broken.has(name41)) {
        return broken.get(name41);
      }
      broken.set(name41, false);
      if (descriptor.syntax !== null) {
        walk(descriptor.syntax, function(node) {
          if (node.type !== "Type" && node.type !== "Property") {
            return;
          }
          const map = node.type === "Type" ? syntax.types : syntax.properties;
          const brokenMap = node.type === "Type" ? brokenTypes : brokenProperties;
          if (!hasOwnProperty.call(map, node.name) || validate(syntax, node.name, brokenMap, map[node.name])) {
            broken.set(name41, true);
          }
        }, this);
      }
    }
    let brokenTypes = /* @__PURE__ */ new Map();
    let brokenProperties = /* @__PURE__ */ new Map();
    for (const key in this.types) {
      validate(this, key, brokenTypes, this.types[key]);
    }
    for (const key in this.properties) {
      validate(this, key, brokenProperties, this.properties[key]);
    }
    brokenTypes = [...brokenTypes.keys()].filter((name41) => brokenTypes.get(name41));
    brokenProperties = [...brokenProperties.keys()].filter((name41) => brokenProperties.get(name41));
    if (brokenTypes.length || brokenProperties.length) {
      return {
        types: brokenTypes,
        properties: brokenProperties
      };
    }
    return null;
  }
  dump(syntaxAsAst, pretty) {
    return {
      generic: this.generic,
      types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
      properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst),
      atrules: dumpAtruleMapSyntax(this.atrules, !pretty, syntaxAsAst)
    };
  }
  toString() {
    return JSON.stringify(this.dump());
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/config/mix.js
var { hasOwnProperty: hasOwnProperty5 } = Object.prototype;
var shape = {
  generic: true,
  types: appendOrAssign,
  atrules: {
    prelude: appendOrAssignOrNull,
    descriptors: appendOrAssignOrNull
  },
  properties: appendOrAssign,
  parseContext: assign,
  scope: deepAssign,
  atrule: ["parse"],
  pseudo: ["parse"],
  node: ["name", "structure", "parse", "generate", "walkContext"]
};
function isObject(value) {
  return value && value.constructor === Object;
}
function copy(value) {
  return isObject(value) ? { ...value } : value;
}
function assign(dest, src) {
  return Object.assign(dest, src);
}
function deepAssign(dest, src) {
  for (const key in src) {
    if (hasOwnProperty5.call(src, key)) {
      if (isObject(dest[key])) {
        deepAssign(dest[key], copy(src[key]));
      } else {
        dest[key] = copy(src[key]);
      }
    }
  }
  return dest;
}
function append(a, b) {
  if (typeof b === "string" && /^\s*\|/.test(b)) {
    return typeof a === "string" ? a + b : b.replace(/^\s*\|\s*/, "");
  }
  return b || null;
}
function appendOrAssign(a, b) {
  if (typeof b === "string") {
    return append(a, b);
  }
  const result = { ...a };
  for (let key in b) {
    if (hasOwnProperty5.call(b, key)) {
      result[key] = append(hasOwnProperty5.call(a, key) ? a[key] : void 0, b[key]);
    }
  }
  return result;
}
function appendOrAssignOrNull(a, b) {
  const result = appendOrAssign(a, b);
  return !isObject(result) || Object.keys(result).length ? result : null;
}
function mix(dest, src, shape2) {
  for (const key in shape2) {
    if (hasOwnProperty5.call(shape2, key) === false) {
      continue;
    }
    if (shape2[key] === true) {
      if (key in src) {
        if (hasOwnProperty5.call(src, key)) {
          dest[key] = copy(src[key]);
        }
      }
    } else if (shape2[key]) {
      if (typeof shape2[key] === "function") {
        const fn = shape2[key];
        dest[key] = fn({}, dest[key]);
        dest[key] = fn(dest[key] || {}, src[key]);
      } else if (isObject(shape2[key])) {
        const result = {};
        for (let name41 in dest[key]) {
          result[name41] = mix({}, dest[key][name41], shape2[key]);
        }
        for (let name41 in src[key]) {
          result[name41] = mix(result[name41] || {}, src[key][name41], shape2[key]);
        }
        dest[key] = result;
      } else if (Array.isArray(shape2[key])) {
        const res = {};
        const innerShape = shape2[key].reduce(function(s, k) {
          s[k] = true;
          return s;
        }, {});
        for (const [name41, value] of Object.entries(dest[key] || {})) {
          res[name41] = {};
          if (value) {
            mix(res[name41], value, innerShape);
          }
        }
        for (const name41 in src[key]) {
          if (hasOwnProperty5.call(src[key], name41)) {
            if (!res[name41]) {
              res[name41] = {};
            }
            if (src[key] && src[key][name41]) {
              mix(res[name41], src[key][name41], innerShape);
            }
          }
        }
        dest[key] = res;
      }
    }
  }
  return dest;
}
var mix_default = (dest, src) => mix(dest, src, shape);

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/create.js
function createSyntax(config) {
  const parse43 = createParser(config);
  const walk3 = createWalker(config);
  const generate43 = createGenerator(config);
  const { fromPlainObject: fromPlainObject2, toPlainObject: toPlainObject2 } = createConvertor(walk3);
  const syntax = {
    lexer: null,
    createLexer: (config2) => new Lexer(config2, syntax, syntax.lexer.structure),
    tokenize,
    parse: parse43,
    generate: generate43,
    walk: walk3,
    find: walk3.find,
    findLast: walk3.findLast,
    findAll: walk3.findAll,
    fromPlainObject: fromPlainObject2,
    toPlainObject: toPlainObject2,
    fork(extension) {
      const base = mix_default({}, config);
      return createSyntax(typeof extension === "function" ? extension(base, Object.assign) : mix_default(base, extension));
    }
  };
  syntax.lexer = new Lexer({
    generic: true,
    types: config.types,
    atrules: config.atrules,
    properties: config.properties,
    node: config.node
  }, syntax);
  return syntax;
}
var create_default = (config) => createSyntax(mix_default({}, config));

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/data.js
var import_module2 = require("module");

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/data-patch.js
var import_module = require("module");
var import_meta = {};
var require2 = (0, import_module.createRequire)(import_meta.url);
var patch = require2("../data/patch.json");
var data_patch_default = patch;

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/data.js
var import_meta2 = {};
var require3 = (0, import_module2.createRequire)(import_meta2.url);
var mdnAtrules = require3("mdn-data/css/at-rules.json");
var mdnProperties = require3("mdn-data/css/properties.json");
var mdnSyntaxes = require3("mdn-data/css/syntaxes.json");
var extendSyntax = /^\s*\|\s*/;
function preprocessAtrules(dict) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const atruleName in dict) {
    const atrule = dict[atruleName];
    let descriptors = null;
    if (atrule.descriptors) {
      descriptors = /* @__PURE__ */ Object.create(null);
      for (const descriptor in atrule.descriptors) {
        descriptors[descriptor] = atrule.descriptors[descriptor].syntax;
      }
    }
    result[atruleName.substr(1)] = {
      prelude: atrule.syntax.trim().replace(/\{(.|\s)+\}/, "").match(/^@\S+\s+([^;\{]*)/)[1].trim() || null,
      descriptors
    };
  }
  return result;
}
function patchDictionary(dict, patchDict) {
  const result = {};
  for (const key in dict) {
    result[key] = dict[key].syntax || dict[key];
  }
  for (const key in patchDict) {
    if (key in dict) {
      if (patchDict[key].syntax) {
        result[key] = extendSyntax.test(patchDict[key].syntax) ? result[key] + " " + patchDict[key].syntax.trim() : patchDict[key].syntax;
      } else {
        delete result[key];
      }
    } else {
      if (patchDict[key].syntax) {
        result[key] = patchDict[key].syntax.replace(extendSyntax, "");
      }
    }
  }
  return result;
}
function patchAtrules(dict, patchDict) {
  const result = {};
  for (const key in dict) {
    const patchDescriptors = patchDict[key] && patchDict[key].descriptors || null;
    result[key] = {
      prelude: key in patchDict && "prelude" in patchDict[key] ? patchDict[key].prelude : dict[key].prelude || null,
      descriptors: patchDictionary(dict[key].descriptors || {}, patchDescriptors || {})
    };
  }
  for (const key in patchDict) {
    if (!hasOwnProperty.call(dict, key)) {
      result[key] = {
        prelude: patchDict[key].prelude || null,
        descriptors: patchDict[key].descriptors && patchDictionary({}, patchDict[key].descriptors)
      };
    }
  }
  return result;
}
var data_default = {
  types: patchDictionary(mdnSyntaxes, data_patch_default.types),
  atrules: patchAtrules(preprocessAtrules(mdnAtrules), data_patch_default.atrules),
  properties: patchDictionary(mdnProperties, data_patch_default.properties)
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/index.js
var node_exports = {};
__export(node_exports, {
  AnPlusB: () => AnPlusB_exports,
  Atrule: () => Atrule_exports,
  AtrulePrelude: () => AtrulePrelude_exports,
  AttributeSelector: () => AttributeSelector_exports,
  Block: () => Block_exports,
  Brackets: () => Brackets_exports,
  CDC: () => CDC_exports,
  CDO: () => CDO_exports,
  ClassSelector: () => ClassSelector_exports,
  Combinator: () => Combinator_exports,
  Comment: () => Comment_exports,
  Declaration: () => Declaration_exports,
  DeclarationList: () => DeclarationList_exports,
  Dimension: () => Dimension_exports,
  Function: () => Function_exports,
  Hash: () => Hash_exports,
  IdSelector: () => IdSelector_exports,
  Identifier: () => Identifier_exports,
  MediaFeature: () => MediaFeature_exports,
  MediaQuery: () => MediaQuery_exports,
  MediaQueryList: () => MediaQueryList_exports,
  Nth: () => Nth_exports,
  Number: () => Number_exports,
  Operator: () => Operator_exports,
  Parentheses: () => Parentheses_exports,
  Percentage: () => Percentage_exports,
  PseudoClassSelector: () => PseudoClassSelector_exports,
  PseudoElementSelector: () => PseudoElementSelector_exports,
  Ratio: () => Ratio_exports,
  Raw: () => Raw_exports,
  Rule: () => Rule_exports,
  Selector: () => Selector_exports,
  SelectorList: () => SelectorList_exports,
  String: () => String_exports,
  StyleSheet: () => StyleSheet_exports,
  TypeSelector: () => TypeSelector_exports,
  UnicodeRange: () => UnicodeRange_exports,
  Url: () => Url_exports,
  Value: () => Value_exports,
  WhiteSpace: () => WhiteSpace_exports
});

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/AnPlusB.js
var AnPlusB_exports = {};
__export(AnPlusB_exports, {
  generate: () => generate2,
  name: () => name,
  parse: () => parse2,
  structure: () => structure
});
var PLUSSIGN5 = 43;
var HYPHENMINUS5 = 45;
var N5 = 110;
var DISALLOW_SIGN2 = true;
var ALLOW_SIGN2 = false;
function checkInteger2(offset, disallowSign) {
  let pos = this.tokenStart + offset;
  const code2 = this.charCodeAt(pos);
  if (code2 === PLUSSIGN5 || code2 === HYPHENMINUS5) {
    if (disallowSign) {
      this.error("Number sign is not allowed");
    }
    pos++;
  }
  for (; pos < this.tokenEnd; pos++) {
    if (!isDigit(this.charCodeAt(pos))) {
      this.error("Integer is expected", pos);
    }
  }
}
function checkTokenIsInteger(disallowSign) {
  return checkInteger2.call(this, 0, disallowSign);
}
function expectCharCode(offset, code2) {
  if (!this.cmpChar(this.tokenStart + offset, code2)) {
    let msg = "";
    switch (code2) {
      case N5:
        msg = "N is expected";
        break;
      case HYPHENMINUS5:
        msg = "HyphenMinus is expected";
        break;
    }
    this.error(msg, this.tokenStart + offset);
  }
}
function consumeB2() {
  let offset = 0;
  let sign = 0;
  let type = this.tokenType;
  while (type === WhiteSpace || type === Comment) {
    type = this.lookupType(++offset);
  }
  if (type !== Number2) {
    if (this.isDelim(PLUSSIGN5, offset) || this.isDelim(HYPHENMINUS5, offset)) {
      sign = this.isDelim(PLUSSIGN5, offset) ? PLUSSIGN5 : HYPHENMINUS5;
      do {
        type = this.lookupType(++offset);
      } while (type === WhiteSpace || type === Comment);
      if (type !== Number2) {
        this.skip(offset);
        checkTokenIsInteger.call(this, DISALLOW_SIGN2);
      }
    } else {
      return null;
    }
  }
  if (offset > 0) {
    this.skip(offset);
  }
  if (sign === 0) {
    type = this.charCodeAt(this.tokenStart);
    if (type !== PLUSSIGN5 && type !== HYPHENMINUS5) {
      this.error("Number sign is expected");
    }
  }
  checkTokenIsInteger.call(this, sign !== 0);
  return sign === HYPHENMINUS5 ? "-" + this.consume(Number2) : this.consume(Number2);
}
var name = "AnPlusB";
var structure = {
  a: [String, null],
  b: [String, null]
};
function parse2() {
  const start = this.tokenStart;
  let a = null;
  let b = null;
  if (this.tokenType === Number2) {
    checkTokenIsInteger.call(this, ALLOW_SIGN2);
    b = this.consume(Number2);
  } else if (this.tokenType === Ident && this.cmpChar(this.tokenStart, HYPHENMINUS5)) {
    a = "-1";
    expectCharCode.call(this, 1, N5);
    switch (this.tokenEnd - this.tokenStart) {
      case 2:
        this.next();
        b = consumeB2.call(this);
        break;
      case 3:
        expectCharCode.call(this, 2, HYPHENMINUS5);
        this.next();
        this.skipSC();
        checkTokenIsInteger.call(this, DISALLOW_SIGN2);
        b = "-" + this.consume(Number2);
        break;
      default:
        expectCharCode.call(this, 2, HYPHENMINUS5);
        checkInteger2.call(this, 3, DISALLOW_SIGN2);
        this.next();
        b = this.substrToCursor(start + 2);
    }
  } else if (this.tokenType === Ident || this.isDelim(PLUSSIGN5) && this.lookupType(1) === Ident) {
    let sign = 0;
    a = "1";
    if (this.isDelim(PLUSSIGN5)) {
      sign = 1;
      this.next();
    }
    expectCharCode.call(this, 0, N5);
    switch (this.tokenEnd - this.tokenStart) {
      case 1:
        this.next();
        b = consumeB2.call(this);
        break;
      case 2:
        expectCharCode.call(this, 1, HYPHENMINUS5);
        this.next();
        this.skipSC();
        checkTokenIsInteger.call(this, DISALLOW_SIGN2);
        b = "-" + this.consume(Number2);
        break;
      default:
        expectCharCode.call(this, 1, HYPHENMINUS5);
        checkInteger2.call(this, 2, DISALLOW_SIGN2);
        this.next();
        b = this.substrToCursor(start + sign + 1);
    }
  } else if (this.tokenType === Dimension) {
    const code2 = this.charCodeAt(this.tokenStart);
    const sign = code2 === PLUSSIGN5 || code2 === HYPHENMINUS5;
    let i = this.tokenStart + sign;
    for (; i < this.tokenEnd; i++) {
      if (!isDigit(this.charCodeAt(i))) {
        break;
      }
    }
    if (i === this.tokenStart + sign) {
      this.error("Integer is expected", this.tokenStart + sign);
    }
    expectCharCode.call(this, i - this.tokenStart, N5);
    a = this.substring(start, i);
    if (i + 1 === this.tokenEnd) {
      this.next();
      b = consumeB2.call(this);
    } else {
      expectCharCode.call(this, i - this.tokenStart + 1, HYPHENMINUS5);
      if (i + 2 === this.tokenEnd) {
        this.next();
        this.skipSC();
        checkTokenIsInteger.call(this, DISALLOW_SIGN2);
        b = "-" + this.consume(Number2);
      } else {
        checkInteger2.call(this, i - this.tokenStart + 2, DISALLOW_SIGN2);
        this.next();
        b = this.substrToCursor(i + 1);
      }
    }
  } else {
    this.error();
  }
  if (a !== null && a.charCodeAt(0) === PLUSSIGN5) {
    a = a.substr(1);
  }
  if (b !== null && b.charCodeAt(0) === PLUSSIGN5) {
    b = b.substr(1);
  }
  return {
    type: "AnPlusB",
    loc: this.getLocation(start, this.tokenStart),
    a,
    b
  };
}
function generate2(node) {
  if (node.a) {
    const a = node.a === "+1" && "n" || node.a === "1" && "n" || node.a === "-1" && "-n" || node.a + "n";
    if (node.b) {
      const b = node.b[0] === "-" || node.b[0] === "+" ? node.b : "+" + node.b;
      this.tokenize(a + b);
    } else {
      this.tokenize(a);
    }
  } else {
    this.tokenize(node.b);
  }
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Atrule.js
var Atrule_exports = {};
__export(Atrule_exports, {
  generate: () => generate3,
  name: () => name2,
  parse: () => parse3,
  structure: () => structure2,
  walkContext: () => walkContext
});
function consumeRaw(startToken) {
  return this.Raw(startToken, this.consumeUntilLeftCurlyBracketOrSemicolon, true);
}
function isDeclarationBlockAtrule() {
  for (let offset = 1, type; type = this.lookupType(offset); offset++) {
    if (type === RightCurlyBracket) {
      return true;
    }
    if (type === LeftCurlyBracket || type === AtKeyword) {
      return false;
    }
  }
  return false;
}
var name2 = "Atrule";
var walkContext = "atrule";
var structure2 = {
  name: String,
  prelude: ["AtrulePrelude", "Raw", null],
  block: ["Block", null]
};
function parse3() {
  const start = this.tokenStart;
  let name41;
  let nameLowerCase;
  let prelude = null;
  let block = null;
  this.eat(AtKeyword);
  name41 = this.substrToCursor(start + 1);
  nameLowerCase = name41.toLowerCase();
  this.skipSC();
  if (this.eof === false && this.tokenType !== LeftCurlyBracket && this.tokenType !== Semicolon) {
    if (this.parseAtrulePrelude) {
      prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name41), consumeRaw);
    } else {
      prelude = consumeRaw.call(this, this.tokenIndex);
    }
    this.skipSC();
  }
  switch (this.tokenType) {
    case Semicolon:
      this.next();
      break;
    case LeftCurlyBracket:
      if (hasOwnProperty.call(this.atrule, nameLowerCase) && typeof this.atrule[nameLowerCase].block === "function") {
        block = this.atrule[nameLowerCase].block.call(this);
      } else {
        block = this.Block(isDeclarationBlockAtrule.call(this));
      }
      break;
  }
  return {
    type: "Atrule",
    loc: this.getLocation(start, this.tokenStart),
    name: name41,
    prelude,
    block
  };
}
function generate3(node) {
  this.token(AtKeyword, "@" + node.name);
  if (node.prelude !== null) {
    this.node(node.prelude);
  }
  if (node.block) {
    this.node(node.block);
  } else {
    this.token(Semicolon, ";");
  }
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/AtrulePrelude.js
var AtrulePrelude_exports = {};
__export(AtrulePrelude_exports, {
  generate: () => generate4,
  name: () => name3,
  parse: () => parse4,
  structure: () => structure3,
  walkContext: () => walkContext2
});
var name3 = "AtrulePrelude";
var walkContext2 = "atrulePrelude";
var structure3 = {
  children: [[]]
};
function parse4(name41) {
  let children = null;
  if (name41 !== null) {
    name41 = name41.toLowerCase();
  }
  this.skipSC();
  if (hasOwnProperty.call(this.atrule, name41) && typeof this.atrule[name41].prelude === "function") {
    children = this.atrule[name41].prelude.call(this);
  } else {
    children = this.readSequence(this.scope.AtrulePrelude);
  }
  this.skipSC();
  if (this.eof !== true && this.tokenType !== LeftCurlyBracket && this.tokenType !== Semicolon) {
    this.error("Semicolon or block is expected");
  }
  return {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate4(node) {
  this.children(node);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/AttributeSelector.js
var AttributeSelector_exports = {};
__export(AttributeSelector_exports, {
  generate: () => generate5,
  name: () => name4,
  parse: () => parse5,
  structure: () => structure4
});
var DOLLARSIGN = 36;
var ASTERISK2 = 42;
var EQUALSSIGN = 61;
var CIRCUMFLEXACCENT = 94;
var VERTICALLINE2 = 124;
var TILDE = 126;
function getAttributeName() {
  if (this.eof) {
    this.error("Unexpected end of input");
  }
  const start = this.tokenStart;
  let expectIdent = false;
  if (this.isDelim(ASTERISK2)) {
    expectIdent = true;
    this.next();
  } else if (!this.isDelim(VERTICALLINE2)) {
    this.eat(Ident);
  }
  if (this.isDelim(VERTICALLINE2)) {
    if (this.charCodeAt(this.tokenStart + 1) !== EQUALSSIGN) {
      this.next();
      this.eat(Ident);
    } else if (expectIdent) {
      this.error("Identifier is expected", this.tokenEnd);
    }
  } else if (expectIdent) {
    this.error("Vertical line is expected");
  }
  return {
    type: "Identifier",
    loc: this.getLocation(start, this.tokenStart),
    name: this.substrToCursor(start)
  };
}
function getOperator() {
  const start = this.tokenStart;
  const code2 = this.charCodeAt(start);
  if (code2 !== EQUALSSIGN && code2 !== TILDE && code2 !== CIRCUMFLEXACCENT && code2 !== DOLLARSIGN && code2 !== ASTERISK2 && code2 !== VERTICALLINE2) {
    this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected");
  }
  this.next();
  if (code2 !== EQUALSSIGN) {
    if (!this.isDelim(EQUALSSIGN)) {
      this.error("Equal sign is expected");
    }
    this.next();
  }
  return this.substrToCursor(start);
}
var name4 = "AttributeSelector";
var structure4 = {
  name: "Identifier",
  matcher: [String, null],
  value: ["String", "Identifier", null],
  flags: [String, null]
};
function parse5() {
  const start = this.tokenStart;
  let name41;
  let matcher = null;
  let value = null;
  let flags = null;
  this.eat(LeftSquareBracket);
  this.skipSC();
  name41 = getAttributeName.call(this);
  this.skipSC();
  if (this.tokenType !== RightSquareBracket) {
    if (this.tokenType !== Ident) {
      matcher = getOperator.call(this);
      this.skipSC();
      value = this.tokenType === String2 ? this.String() : this.Identifier();
      this.skipSC();
    }
    if (this.tokenType === Ident) {
      flags = this.consume(Ident);
      this.skipSC();
    }
  }
  this.eat(RightSquareBracket);
  return {
    type: "AttributeSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: name41,
    matcher,
    value,
    flags
  };
}
function generate5(node) {
  this.token(Delim, "[");
  this.node(node.name);
  if (node.matcher !== null) {
    this.tokenize(node.matcher);
    this.node(node.value);
  }
  if (node.flags !== null) {
    this.token(Ident, node.flags);
  }
  this.token(Delim, "]");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Block.js
var Block_exports = {};
__export(Block_exports, {
  generate: () => generate6,
  name: () => name5,
  parse: () => parse6,
  structure: () => structure5,
  walkContext: () => walkContext3
});
function consumeRaw2(startToken) {
  return this.Raw(startToken, null, true);
}
function consumeRule() {
  return this.parseWithFallback(this.Rule, consumeRaw2);
}
function consumeRawDeclaration(startToken) {
  return this.Raw(startToken, this.consumeUntilSemicolonIncluded, true);
}
function consumeDeclaration() {
  if (this.tokenType === Semicolon) {
    return consumeRawDeclaration.call(this, this.tokenIndex);
  }
  const node = this.parseWithFallback(this.Declaration, consumeRawDeclaration);
  if (this.tokenType === Semicolon) {
    this.next();
  }
  return node;
}
var name5 = "Block";
var walkContext3 = "block";
var structure5 = {
  children: [[
    "Atrule",
    "Rule",
    "Declaration"
  ]]
};
function parse6(isDeclaration) {
  const consumer = isDeclaration ? consumeDeclaration : consumeRule;
  const start = this.tokenStart;
  let children = this.createList();
  this.eat(LeftCurlyBracket);
  scan:
    while (!this.eof) {
      switch (this.tokenType) {
        case RightCurlyBracket:
          break scan;
        case WhiteSpace:
        case Comment:
          this.next();
          break;
        case AtKeyword:
          children.push(this.parseWithFallback(this.Atrule, consumeRaw2));
          break;
        default:
          children.push(consumer.call(this));
      }
    }
  if (!this.eof) {
    this.eat(RightCurlyBracket);
  }
  return {
    type: "Block",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate6(node) {
  this.token(LeftCurlyBracket, "{");
  this.children(node, (prev) => {
    if (prev.type === "Declaration") {
      this.token(Semicolon, ";");
    }
  });
  this.token(RightCurlyBracket, "}");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Brackets.js
var Brackets_exports = {};
__export(Brackets_exports, {
  generate: () => generate7,
  name: () => name6,
  parse: () => parse7,
  structure: () => structure6
});
var name6 = "Brackets";
var structure6 = {
  children: [[]]
};
function parse7(readSequence3, recognizer) {
  const start = this.tokenStart;
  let children = null;
  this.eat(LeftSquareBracket);
  children = readSequence3.call(this, recognizer);
  if (!this.eof) {
    this.eat(RightSquareBracket);
  }
  return {
    type: "Brackets",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate7(node) {
  this.token(Delim, "[");
  this.children(node);
  this.token(Delim, "]");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/CDC.js
var CDC_exports = {};
__export(CDC_exports, {
  generate: () => generate8,
  name: () => name7,
  parse: () => parse8,
  structure: () => structure7
});
var name7 = "CDC";
var structure7 = [];
function parse8() {
  const start = this.tokenStart;
  this.eat(CDC);
  return {
    type: "CDC",
    loc: this.getLocation(start, this.tokenStart)
  };
}
function generate8() {
  this.token(CDC, "-->");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/CDO.js
var CDO_exports = {};
__export(CDO_exports, {
  generate: () => generate9,
  name: () => name8,
  parse: () => parse9,
  structure: () => structure8
});
var name8 = "CDO";
var structure8 = [];
function parse9() {
  const start = this.tokenStart;
  this.eat(CDO);
  return {
    type: "CDO",
    loc: this.getLocation(start, this.tokenStart)
  };
}
function generate9() {
  this.token(CDO, "<!--");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/ClassSelector.js
var ClassSelector_exports = {};
__export(ClassSelector_exports, {
  generate: () => generate10,
  name: () => name9,
  parse: () => parse10,
  structure: () => structure9
});
var FULLSTOP = 46;
var name9 = "ClassSelector";
var structure9 = {
  name: String
};
function parse10() {
  this.eatDelim(FULLSTOP);
  return {
    type: "ClassSelector",
    loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
    name: this.consume(Ident)
  };
}
function generate10(node) {
  this.token(Delim, ".");
  this.token(Ident, node.name);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Combinator.js
var Combinator_exports = {};
__export(Combinator_exports, {
  generate: () => generate11,
  name: () => name10,
  parse: () => parse11,
  structure: () => structure10
});
var PLUSSIGN6 = 43;
var SOLIDUS = 47;
var GREATERTHANSIGN2 = 62;
var TILDE2 = 126;
var name10 = "Combinator";
var structure10 = {
  name: String
};
function parse11() {
  const start = this.tokenStart;
  let name41;
  switch (this.tokenType) {
    case WhiteSpace:
      name41 = " ";
      break;
    case Delim:
      switch (this.charCodeAt(this.tokenStart)) {
        case GREATERTHANSIGN2:
        case PLUSSIGN6:
        case TILDE2:
          this.next();
          break;
        case SOLIDUS:
          this.next();
          this.eatIdent("deep");
          this.eatDelim(SOLIDUS);
          break;
        default:
          this.error("Combinator is expected");
      }
      name41 = this.substrToCursor(start);
      break;
  }
  return {
    type: "Combinator",
    loc: this.getLocation(start, this.tokenStart),
    name: name41
  };
}
function generate11(node) {
  this.tokenize(node.name);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Comment.js
var Comment_exports = {};
__export(Comment_exports, {
  generate: () => generate12,
  name: () => name11,
  parse: () => parse12,
  structure: () => structure11
});
var ASTERISK3 = 42;
var SOLIDUS2 = 47;
var name11 = "Comment";
var structure11 = {
  value: String
};
function parse12() {
  const start = this.tokenStart;
  let end = this.tokenEnd;
  this.eat(Comment);
  if (end - start + 2 >= 2 && this.charCodeAt(end - 2) === ASTERISK3 && this.charCodeAt(end - 1) === SOLIDUS2) {
    end -= 2;
  }
  return {
    type: "Comment",
    loc: this.getLocation(start, this.tokenStart),
    value: this.substring(start + 2, end)
  };
}
function generate12(node) {
  this.token(Comment, "/*" + node.value + "*/");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Declaration.js
var Declaration_exports = {};
__export(Declaration_exports, {
  generate: () => generate13,
  name: () => name12,
  parse: () => parse13,
  structure: () => structure12,
  walkContext: () => walkContext4
});
var EXCLAMATIONMARK3 = 33;
var NUMBERSIGN3 = 35;
var DOLLARSIGN2 = 36;
var AMPERSAND2 = 38;
var ASTERISK4 = 42;
var PLUSSIGN7 = 43;
var SOLIDUS3 = 47;
function consumeValueRaw(startToken) {
  return this.Raw(startToken, this.consumeUntilExclamationMarkOrSemicolon, true);
}
function consumeCustomPropertyRaw(startToken) {
  return this.Raw(startToken, this.consumeUntilExclamationMarkOrSemicolon, false);
}
function consumeValue() {
  const startValueToken = this.tokenIndex;
  const value = this.Value();
  if (value.type !== "Raw" && this.eof === false && this.tokenType !== Semicolon && this.isDelim(EXCLAMATIONMARK3) === false && this.isBalanceEdge(startValueToken) === false) {
    this.error();
  }
  return value;
}
var name12 = "Declaration";
var walkContext4 = "declaration";
var structure12 = {
  important: [Boolean, String],
  property: String,
  value: ["Value", "Raw"]
};
function parse13() {
  const start = this.tokenStart;
  const startToken = this.tokenIndex;
  const property2 = readProperty2.call(this);
  const customProperty = isCustomProperty(property2);
  const parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
  const consumeRaw7 = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
  let important = false;
  let value;
  this.skipSC();
  this.eat(Colon);
  const valueStart = this.tokenIndex;
  if (!customProperty) {
    this.skipSC();
  }
  if (parseValue) {
    value = this.parseWithFallback(consumeValue, consumeRaw7);
  } else {
    value = consumeRaw7.call(this, this.tokenIndex);
  }
  if (customProperty && value.type === "Value" && value.children.isEmpty) {
    for (let offset = valueStart - this.tokenIndex; offset <= 0; offset++) {
      if (this.lookupType(offset) === WhiteSpace) {
        value.children.appendData({
          type: "WhiteSpace",
          loc: null,
          value: " "
        });
        break;
      }
    }
  }
  if (this.isDelim(EXCLAMATIONMARK3)) {
    important = getImportant.call(this);
    this.skipSC();
  }
  if (this.eof === false && this.tokenType !== Semicolon && this.isBalanceEdge(startToken) === false) {
    this.error();
  }
  return {
    type: "Declaration",
    loc: this.getLocation(start, this.tokenStart),
    important,
    property: property2,
    value
  };
}
function generate13(node) {
  this.token(Ident, node.property);
  this.token(Colon, ":");
  this.node(node.value);
  if (node.important) {
    this.token(Delim, "!");
    this.token(Ident, node.important === true ? "important" : node.important);
  }
}
function readProperty2() {
  const start = this.tokenStart;
  if (this.tokenType === Delim) {
    switch (this.charCodeAt(this.tokenStart)) {
      case ASTERISK4:
      case DOLLARSIGN2:
      case PLUSSIGN7:
      case NUMBERSIGN3:
      case AMPERSAND2:
        this.next();
        break;
      case SOLIDUS3:
        this.next();
        if (this.isDelim(SOLIDUS3)) {
          this.next();
        }
        break;
    }
  }
  if (this.tokenType === Hash) {
    this.eat(Hash);
  } else {
    this.eat(Ident);
  }
  return this.substrToCursor(start);
}
function getImportant() {
  this.eat(Delim);
  this.skipSC();
  const important = this.consume(Ident);
  return important === "important" ? true : important;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/DeclarationList.js
var DeclarationList_exports = {};
__export(DeclarationList_exports, {
  generate: () => generate14,
  name: () => name13,
  parse: () => parse14,
  structure: () => structure13
});
function consumeRaw3(startToken) {
  return this.Raw(startToken, this.consumeUntilSemicolonIncluded, true);
}
var name13 = "DeclarationList";
var structure13 = {
  children: [[
    "Declaration"
  ]]
};
function parse14() {
  const children = this.createList();
  scan:
    while (!this.eof) {
      switch (this.tokenType) {
        case WhiteSpace:
        case Comment:
        case Semicolon:
          this.next();
          break;
        default:
          children.push(this.parseWithFallback(this.Declaration, consumeRaw3));
      }
    }
  return {
    type: "DeclarationList",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate14(node) {
  this.children(node, (prev) => {
    if (prev.type === "Declaration") {
      this.token(Semicolon, ";");
    }
  });
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Dimension.js
var Dimension_exports = {};
__export(Dimension_exports, {
  generate: () => generate15,
  name: () => name14,
  parse: () => parse15,
  structure: () => structure14
});
var name14 = "Dimension";
var structure14 = {
  value: String,
  unit: String
};
function parse15() {
  const start = this.tokenStart;
  const value = this.consumeNumber(Dimension);
  return {
    type: "Dimension",
    loc: this.getLocation(start, this.tokenStart),
    value,
    unit: this.substring(start + value.length, this.tokenStart)
  };
}
function generate15(node) {
  this.token(Dimension, node.value + node.unit);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Function.js
var Function_exports = {};
__export(Function_exports, {
  generate: () => generate16,
  name: () => name15,
  parse: () => parse16,
  structure: () => structure15,
  walkContext: () => walkContext5
});
var name15 = "Function";
var walkContext5 = "function";
var structure15 = {
  name: String,
  children: [[]]
};
function parse16(readSequence3, recognizer) {
  const start = this.tokenStart;
  const name41 = this.consumeFunctionName();
  const nameLowerCase = name41.toLowerCase();
  let children;
  children = recognizer.hasOwnProperty(nameLowerCase) ? recognizer[nameLowerCase].call(this, recognizer) : readSequence3.call(this, recognizer);
  if (!this.eof) {
    this.eat(RightParenthesis);
  }
  return {
    type: "Function",
    loc: this.getLocation(start, this.tokenStart),
    name: name41,
    children
  };
}
function generate16(node) {
  this.token(Function2, node.name + "(");
  this.children(node);
  this.token(RightParenthesis, ")");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Hash.js
var Hash_exports = {};
__export(Hash_exports, {
  generate: () => generate17,
  name: () => name16,
  parse: () => parse17,
  structure: () => structure16,
  xxx: () => xxx
});
var xxx = "XXX";
var name16 = "Hash";
var structure16 = {
  value: String
};
function parse17() {
  const start = this.tokenStart;
  this.eat(Hash);
  return {
    type: "Hash",
    loc: this.getLocation(start, this.tokenStart),
    value: this.substrToCursor(start + 1)
  };
}
function generate17(node) {
  this.token(Hash, "#" + node.value);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Identifier.js
var Identifier_exports = {};
__export(Identifier_exports, {
  generate: () => generate18,
  name: () => name17,
  parse: () => parse18,
  structure: () => structure17
});
var name17 = "Identifier";
var structure17 = {
  name: String
};
function parse18() {
  return {
    type: "Identifier",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: this.consume(Ident)
  };
}
function generate18(node) {
  this.token(Ident, node.name);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/IdSelector.js
var IdSelector_exports = {};
__export(IdSelector_exports, {
  generate: () => generate19,
  name: () => name18,
  parse: () => parse19,
  structure: () => structure18
});
var name18 = "IdSelector";
var structure18 = {
  name: String
};
function parse19() {
  const start = this.tokenStart;
  this.eat(Hash);
  return {
    type: "IdSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: this.substrToCursor(start + 1)
  };
}
function generate19(node) {
  this.token(Delim, "#" + node.name);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/MediaFeature.js
var MediaFeature_exports = {};
__export(MediaFeature_exports, {
  generate: () => generate20,
  name: () => name19,
  parse: () => parse20,
  structure: () => structure19
});
var name19 = "MediaFeature";
var structure19 = {
  name: String,
  value: ["Identifier", "Number", "Dimension", "Ratio", null]
};
function parse20() {
  const start = this.tokenStart;
  let name41;
  let value = null;
  this.eat(LeftParenthesis);
  this.skipSC();
  name41 = this.consume(Ident);
  this.skipSC();
  if (this.tokenType !== RightParenthesis) {
    this.eat(Colon);
    this.skipSC();
    switch (this.tokenType) {
      case Number2:
        if (this.lookupNonWSType(1) === Delim) {
          value = this.Ratio();
        } else {
          value = this.Number();
        }
        break;
      case Dimension:
        value = this.Dimension();
        break;
      case Ident:
        value = this.Identifier();
        break;
      default:
        this.error("Number, dimension, ratio or identifier is expected");
    }
    this.skipSC();
  }
  this.eat(RightParenthesis);
  return {
    type: "MediaFeature",
    loc: this.getLocation(start, this.tokenStart),
    name: name41,
    value
  };
}
function generate20(node) {
  this.token(LeftParenthesis, "(");
  this.token(Ident, node.name);
  if (node.value !== null) {
    this.token(Colon, ":");
    this.node(node.value);
  }
  this.token(RightParenthesis, ")");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/MediaQuery.js
var MediaQuery_exports = {};
__export(MediaQuery_exports, {
  generate: () => generate21,
  name: () => name20,
  parse: () => parse21,
  structure: () => structure20
});
var name20 = "MediaQuery";
var structure20 = {
  children: [[
    "Identifier",
    "MediaFeature",
    "WhiteSpace"
  ]]
};
function parse21() {
  const children = this.createList();
  let child = null;
  this.skipSC();
  scan:
    while (!this.eof) {
      switch (this.tokenType) {
        case Comment:
        case WhiteSpace:
          this.next();
          continue;
        case Ident:
          child = this.Identifier();
          break;
        case LeftParenthesis:
          child = this.MediaFeature();
          break;
        default:
          break scan;
      }
      children.push(child);
    }
  if (child === null) {
    this.error("Identifier or parenthesis is expected");
  }
  return {
    type: "MediaQuery",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate21(node) {
  this.children(node);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/MediaQueryList.js
var MediaQueryList_exports = {};
__export(MediaQueryList_exports, {
  generate: () => generate22,
  name: () => name21,
  parse: () => parse22,
  structure: () => structure21
});
var name21 = "MediaQueryList";
var structure21 = {
  children: [[
    "MediaQuery"
  ]]
};
function parse22() {
  const children = this.createList();
  this.skipSC();
  while (!this.eof) {
    children.push(this.MediaQuery());
    if (this.tokenType !== Comma) {
      break;
    }
    this.next();
  }
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate22(node) {
  this.children(node, () => this.token(Comma, ","));
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Nth.js
var Nth_exports = {};
__export(Nth_exports, {
  generate: () => generate23,
  name: () => name22,
  parse: () => parse23,
  structure: () => structure22
});
var name22 = "Nth";
var structure22 = {
  nth: ["AnPlusB", "Identifier"],
  selector: ["SelectorList", null]
};
function parse23() {
  this.skipSC();
  const start = this.tokenStart;
  let end = start;
  let selector2 = null;
  let nth2;
  if (this.lookupValue(0, "odd") || this.lookupValue(0, "even")) {
    nth2 = this.Identifier();
  } else {
    nth2 = this.AnPlusB();
  }
  end = this.tokenStart;
  this.skipSC();
  if (this.lookupValue(0, "of")) {
    this.next();
    selector2 = this.SelectorList();
    end = this.tokenStart;
  }
  return {
    type: "Nth",
    loc: this.getLocation(start, end),
    nth: nth2,
    selector: selector2
  };
}
function generate23(node) {
  this.node(node.nth);
  if (node.selector !== null) {
    this.token(Ident, "of");
    this.node(node.selector);
  }
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Number.js
var Number_exports = {};
__export(Number_exports, {
  generate: () => generate24,
  name: () => name23,
  parse: () => parse24,
  structure: () => structure23
});
var name23 = "Number";
var structure23 = {
  value: String
};
function parse24() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume(Number2)
  };
}
function generate24(node) {
  this.token(Number2, node.value);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Operator.js
var Operator_exports = {};
__export(Operator_exports, {
  generate: () => generate25,
  name: () => name24,
  parse: () => parse25,
  structure: () => structure24
});
var name24 = "Operator";
var structure24 = {
  value: String
};
function parse25() {
  const start = this.tokenStart;
  this.next();
  return {
    type: "Operator",
    loc: this.getLocation(start, this.tokenStart),
    value: this.substrToCursor(start)
  };
}
function generate25(node) {
  this.tokenize(node.value);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Parentheses.js
var Parentheses_exports = {};
__export(Parentheses_exports, {
  generate: () => generate26,
  name: () => name25,
  parse: () => parse26,
  structure: () => structure25
});
var name25 = "Parentheses";
var structure25 = {
  children: [[]]
};
function parse26(readSequence3, recognizer) {
  const start = this.tokenStart;
  let children = null;
  this.eat(LeftParenthesis);
  children = readSequence3.call(this, recognizer);
  if (!this.eof) {
    this.eat(RightParenthesis);
  }
  return {
    type: "Parentheses",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate26(node) {
  this.token(LeftParenthesis, "(");
  this.children(node);
  this.token(RightParenthesis, ")");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Percentage.js
var Percentage_exports = {};
__export(Percentage_exports, {
  generate: () => generate27,
  name: () => name26,
  parse: () => parse27,
  structure: () => structure26
});
var name26 = "Percentage";
var structure26 = {
  value: String
};
function parse27() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(Percentage)
  };
}
function generate27(node) {
  this.token(Percentage, node.value + "%");
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/PseudoClassSelector.js
var PseudoClassSelector_exports = {};
__export(PseudoClassSelector_exports, {
  generate: () => generate28,
  name: () => name27,
  parse: () => parse28,
  structure: () => structure27,
  walkContext: () => walkContext6
});
var name27 = "PseudoClassSelector";
var walkContext6 = "function";
var structure27 = {
  name: String,
  children: [["Raw"], null]
};
function parse28() {
  const start = this.tokenStart;
  let children = null;
  let name41;
  let nameLowerCase;
  this.eat(Colon);
  if (this.tokenType === Function2) {
    name41 = this.consumeFunctionName();
    nameLowerCase = name41.toLowerCase();
    if (hasOwnProperty.call(this.pseudo, nameLowerCase)) {
      this.skipSC();
      children = this.pseudo[nameLowerCase].call(this);
      this.skipSC();
    } else {
      children = this.createList();
      children.push(this.Raw(this.tokenIndex, null, false));
    }
    this.eat(RightParenthesis);
  } else {
    name41 = this.consume(Ident);
  }
  return {
    type: "PseudoClassSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: name41,
    children
  };
}
function generate28(node) {
  this.token(Colon, ":");
  if (node.children === null) {
    this.token(Ident, node.name);
  } else {
    this.token(Function2, node.name + "(");
    this.children(node);
    this.token(RightParenthesis, ")");
  }
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/PseudoElementSelector.js
var PseudoElementSelector_exports = {};
__export(PseudoElementSelector_exports, {
  generate: () => generate29,
  name: () => name28,
  parse: () => parse29,
  structure: () => structure28,
  walkContext: () => walkContext7
});
var name28 = "PseudoElementSelector";
var walkContext7 = "function";
var structure28 = {
  name: String,
  children: [["Raw"], null]
};
function parse29() {
  const start = this.tokenStart;
  let children = null;
  let name41;
  let nameLowerCase;
  this.eat(Colon);
  this.eat(Colon);
  if (this.tokenType === Function2) {
    name41 = this.consumeFunctionName();
    nameLowerCase = name41.toLowerCase();
    if (hasOwnProperty.call(this.pseudo, nameLowerCase)) {
      this.skipSC();
      children = this.pseudo[nameLowerCase].call(this);
      this.skipSC();
    } else {
      children = this.createList();
      children.push(this.Raw(this.tokenIndex, null, false));
    }
    this.eat(RightParenthesis);
  } else {
    name41 = this.consume(Ident);
  }
  return {
    type: "PseudoElementSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: name41,
    children
  };
}
function generate29(node) {
  this.token(Colon, ":");
  this.token(Colon, ":");
  if (node.children === null) {
    this.token(Ident, node.name);
  } else {
    this.token(Function2, node.name + "(");
    this.children(node);
    this.token(RightParenthesis, ")");
  }
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Ratio.js
var Ratio_exports = {};
__export(Ratio_exports, {
  generate: () => generate30,
  name: () => name29,
  parse: () => parse30,
  structure: () => structure29
});
var SOLIDUS4 = 47;
var FULLSTOP2 = 46;
function consumeNumber2() {
  this.skipSC();
  const value = this.consume(Number2);
  for (let i = 0; i < value.length; i++) {
    const code2 = value.charCodeAt(i);
    if (!isDigit(code2) && code2 !== FULLSTOP2) {
      this.error("Unsigned number is expected", this.tokenStart - value.length + i);
    }
  }
  if (Number(value) === 0) {
    this.error("Zero number is not allowed", this.tokenStart - value.length);
  }
  return value;
}
var name29 = "Ratio";
var structure29 = {
  left: String,
  right: String
};
function parse30() {
  const start = this.tokenStart;
  const left = consumeNumber2.call(this);
  let right;
  this.skipSC();
  this.eatDelim(SOLIDUS4);
  right = consumeNumber2.call(this);
  return {
    type: "Ratio",
    loc: this.getLocation(start, this.tokenStart),
    left,
    right
  };
}
function generate30(node) {
  this.token(Number2, node.left);
  this.token(Delim, "/");
  this.token(Number2, node.right);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Raw.js
var Raw_exports = {};
__export(Raw_exports, {
  generate: () => generate31,
  name: () => name30,
  parse: () => parse31,
  structure: () => structure30
});
function getOffsetExcludeWS() {
  if (this.tokenIndex > 0) {
    if (this.lookupType(-1) === WhiteSpace) {
      return this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset;
    }
  }
  return this.tokenStart;
}
var name30 = "Raw";
var structure30 = {
  value: String
};
function parse31(startToken, consumeUntil, excludeWhiteSpace) {
  const startOffset = this.getTokenStart(startToken);
  let endOffset;
  this.skipUntilBalanced(startToken, consumeUntil || this.consumeUntilBalanceEnd);
  if (excludeWhiteSpace && this.tokenStart > startOffset) {
    endOffset = getOffsetExcludeWS.call(this);
  } else {
    endOffset = this.tokenStart;
  }
  return {
    type: "Raw",
    loc: this.getLocation(startOffset, endOffset),
    value: this.substring(startOffset, endOffset)
  };
}
function generate31(node) {
  this.tokenize(node.value);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Rule.js
var Rule_exports = {};
__export(Rule_exports, {
  generate: () => generate32,
  name: () => name31,
  parse: () => parse32,
  structure: () => structure31,
  walkContext: () => walkContext8
});
function consumeRaw4(startToken) {
  return this.Raw(startToken, this.consumeUntilLeftCurlyBracket, true);
}
function consumePrelude() {
  const prelude = this.SelectorList();
  if (prelude.type !== "Raw" && this.eof === false && this.tokenType !== LeftCurlyBracket) {
    this.error();
  }
  return prelude;
}
var name31 = "Rule";
var walkContext8 = "rule";
var structure31 = {
  prelude: ["SelectorList", "Raw"],
  block: ["Block"]
};
function parse32() {
  const startToken = this.tokenIndex;
  const startOffset = this.tokenStart;
  let prelude;
  let block;
  if (this.parseRulePrelude) {
    prelude = this.parseWithFallback(consumePrelude, consumeRaw4);
  } else {
    prelude = consumeRaw4.call(this, startToken);
  }
  block = this.Block(true);
  return {
    type: "Rule",
    loc: this.getLocation(startOffset, this.tokenStart),
    prelude,
    block
  };
}
function generate32(node) {
  this.node(node.prelude);
  this.node(node.block);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Selector.js
var Selector_exports = {};
__export(Selector_exports, {
  generate: () => generate33,
  name: () => name32,
  parse: () => parse33,
  structure: () => structure32
});
var name32 = "Selector";
var structure32 = {
  children: [[
    "TypeSelector",
    "IdSelector",
    "ClassSelector",
    "AttributeSelector",
    "PseudoClassSelector",
    "PseudoElementSelector",
    "Combinator",
    "WhiteSpace"
  ]]
};
function parse33() {
  const children = this.readSequence(this.scope.Selector);
  if (this.getFirstListNode(children) === null) {
    this.error("Selector is expected");
  }
  return {
    type: "Selector",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate33(node) {
  this.children(node);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/SelectorList.js
var SelectorList_exports = {};
__export(SelectorList_exports, {
  generate: () => generate34,
  name: () => name33,
  parse: () => parse34,
  structure: () => structure33,
  walkContext: () => walkContext9
});
var name33 = "SelectorList";
var walkContext9 = "selector";
var structure33 = {
  children: [[
    "Selector",
    "Raw"
  ]]
};
function parse34() {
  const children = this.createList();
  while (!this.eof) {
    children.push(this.Selector());
    if (this.tokenType === Comma) {
      this.next();
      continue;
    }
    break;
  }
  return {
    type: "SelectorList",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate34(node) {
  this.children(node, () => this.token(Comma, ","));
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/String.js
var String_exports = {};
__export(String_exports, {
  generate: () => generate35,
  name: () => name34,
  parse: () => parse35,
  structure: () => structure34
});

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/utils/string.js
var REVERSE_SOLIDUS = 92;
var QUOTATION_MARK = 34;
var APOSTROPHE2 = 39;
function decode(str) {
  const len = str.length;
  const firstChar = str.charCodeAt(0);
  const start = firstChar === QUOTATION_MARK || firstChar === APOSTROPHE2 ? 1 : 0;
  const end = start === 1 && len > 1 && str.charCodeAt(len - 1) === firstChar ? len - 2 : len - 1;
  let decoded = "";
  for (let i = start; i <= end; i++) {
    let code2 = str.charCodeAt(i);
    if (code2 === REVERSE_SOLIDUS) {
      if (i === end) {
        if (i !== len - 1) {
          decoded = str.substr(i + 1);
        }
        break;
      }
      code2 = str.charCodeAt(++i);
      if (isValidEscape(REVERSE_SOLIDUS, code2)) {
        const escapeStart = i - 1;
        const escapeEnd = consumeEscaped(str, escapeStart);
        i = escapeEnd - 1;
        decoded += decodeEscaped(str.substring(escapeStart + 1, escapeEnd));
      } else {
        if (code2 === 13 && str.charCodeAt(i + 1) === 10) {
          i++;
        }
      }
    } else {
      decoded += str[i];
    }
  }
  return decoded;
}
function encode(str, apostrophe) {
  const quote = apostrophe ? "'" : '"';
  const quoteCode = apostrophe ? APOSTROPHE2 : QUOTATION_MARK;
  let encoded = "";
  let wsBeforeHexIsNeeded = false;
  for (let i = 0; i < str.length; i++) {
    const code2 = str.charCodeAt(i);
    if (code2 === 0) {
      encoded += "\uFFFD";
      continue;
    }
    if (code2 <= 31 || code2 === 127) {
      encoded += "\\" + code2.toString(16);
      wsBeforeHexIsNeeded = true;
      continue;
    }
    if (code2 === quoteCode || code2 === REVERSE_SOLIDUS) {
      encoded += "\\" + str.charAt(i);
      wsBeforeHexIsNeeded = false;
    } else {
      if (wsBeforeHexIsNeeded && (isHexDigit(code2) || isWhiteSpace(code2))) {
        encoded += " ";
      }
      encoded += str.charAt(i);
      wsBeforeHexIsNeeded = false;
    }
  }
  return quote + encoded + quote;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/String.js
var name34 = "String";
var structure34 = {
  value: String
};
function parse35() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: decode(this.consume(String2))
  };
}
function generate35(node) {
  this.token(String2, encode(node.value));
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/StyleSheet.js
var StyleSheet_exports = {};
__export(StyleSheet_exports, {
  generate: () => generate36,
  name: () => name35,
  parse: () => parse36,
  structure: () => structure35,
  walkContext: () => walkContext10
});
var EXCLAMATIONMARK4 = 33;
function consumeRaw5(startToken) {
  return this.Raw(startToken, null, false);
}
var name35 = "StyleSheet";
var walkContext10 = "stylesheet";
var structure35 = {
  children: [[
    "Comment",
    "CDO",
    "CDC",
    "Atrule",
    "Rule",
    "Raw"
  ]]
};
function parse36() {
  const start = this.tokenStart;
  const children = this.createList();
  let child;
  scan:
    while (!this.eof) {
      switch (this.tokenType) {
        case WhiteSpace:
          this.next();
          continue;
        case Comment:
          if (this.charCodeAt(this.tokenStart + 2) !== EXCLAMATIONMARK4) {
            this.next();
            continue;
          }
          child = this.Comment();
          break;
        case CDO:
          child = this.CDO();
          break;
        case CDC:
          child = this.CDC();
          break;
        case AtKeyword:
          child = this.parseWithFallback(this.Atrule, consumeRaw5);
          break;
        default:
          child = this.parseWithFallback(this.Rule, consumeRaw5);
      }
      children.push(child);
    }
  return {
    type: "StyleSheet",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate36(node) {
  this.children(node);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/TypeSelector.js
var TypeSelector_exports = {};
__export(TypeSelector_exports, {
  generate: () => generate37,
  name: () => name36,
  parse: () => parse37,
  structure: () => structure36
});
var ASTERISK5 = 42;
var VERTICALLINE3 = 124;
function eatIdentifierOrAsterisk() {
  if (this.tokenType !== Ident && this.isDelim(ASTERISK5) === false) {
    this.error("Identifier or asterisk is expected");
  }
  this.next();
}
var name36 = "TypeSelector";
var structure36 = {
  name: String
};
function parse37() {
  const start = this.tokenStart;
  if (this.isDelim(VERTICALLINE3)) {
    this.next();
    eatIdentifierOrAsterisk.call(this);
  } else {
    eatIdentifierOrAsterisk.call(this);
    if (this.isDelim(VERTICALLINE3)) {
      this.next();
      eatIdentifierOrAsterisk.call(this);
    }
  }
  return {
    type: "TypeSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: this.substrToCursor(start)
  };
}
function generate37(node) {
  this.tokenize(node.name);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/UnicodeRange.js
var UnicodeRange_exports = {};
__export(UnicodeRange_exports, {
  generate: () => generate38,
  name: () => name37,
  parse: () => parse38,
  structure: () => structure37
});
var PLUSSIGN8 = 43;
var HYPHENMINUS6 = 45;
var QUESTIONMARK3 = 63;
function eatHexSequence(offset, allowDash) {
  let len = 0;
  for (let pos = this.tokenStart + offset; pos < this.tokenEnd; pos++) {
    const code2 = this.charCodeAt(pos);
    if (code2 === HYPHENMINUS6 && allowDash && len !== 0) {
      eatHexSequence.call(this, offset + len + 1, false);
      return -1;
    }
    if (!isHexDigit(code2)) {
      this.error(allowDash && len !== 0 ? "Hyphen minus" + (len < 6 ? " or hex digit" : "") + " is expected" : len < 6 ? "Hex digit is expected" : "Unexpected input", pos);
    }
    if (++len > 6) {
      this.error("Too many hex digits", pos);
    }
    ;
  }
  this.next();
  return len;
}
function eatQuestionMarkSequence(max) {
  let count = 0;
  while (this.isDelim(QUESTIONMARK3)) {
    if (++count > max) {
      this.error("Too many question marks");
    }
    this.next();
  }
}
function startsWith2(code2) {
  if (this.charCodeAt(this.tokenStart) !== code2) {
    this.error((code2 === PLUSSIGN8 ? "Plus sign" : "Hyphen minus") + " is expected");
  }
}
function scanUnicodeRange() {
  let hexLength = 0;
  switch (this.tokenType) {
    case Number2:
      hexLength = eatHexSequence.call(this, 1, true);
      if (this.isDelim(QUESTIONMARK3)) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
        break;
      }
      if (this.tokenType === Dimension || this.tokenType === Number2) {
        startsWith2.call(this, HYPHENMINUS6);
        eatHexSequence.call(this, 1, false);
        break;
      }
      break;
    case Dimension:
      hexLength = eatHexSequence.call(this, 1, true);
      if (hexLength > 0) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
      }
      break;
    default:
      this.eatDelim(PLUSSIGN8);
      if (this.tokenType === Ident) {
        hexLength = eatHexSequence.call(this, 0, true);
        if (hexLength > 0) {
          eatQuestionMarkSequence.call(this, 6 - hexLength);
        }
        break;
      }
      if (this.isDelim(QUESTIONMARK3)) {
        this.next();
        eatQuestionMarkSequence.call(this, 5);
        break;
      }
      this.error("Hex digit or question mark is expected");
  }
}
var name37 = "UnicodeRange";
var structure37 = {
  value: String
};
function parse38() {
  const start = this.tokenStart;
  this.eatIdent("u");
  scanUnicodeRange.call(this);
  return {
    type: "UnicodeRange",
    loc: this.getLocation(start, this.tokenStart),
    value: this.substrToCursor(start)
  };
}
function generate38(node) {
  this.tokenize(node.value);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Url.js
var Url_exports = {};
__export(Url_exports, {
  generate: () => generate39,
  name: () => name38,
  parse: () => parse39,
  structure: () => structure38
});

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/utils/url.js
var SPACE3 = 32;
var REVERSE_SOLIDUS2 = 92;
var QUOTATION_MARK2 = 34;
var APOSTROPHE3 = 39;
var LEFTPARENTHESIS3 = 40;
var RIGHTPARENTHESIS3 = 41;
function decode2(str) {
  const len = str.length;
  let start = 4;
  let end = str.charCodeAt(len - 1) === RIGHTPARENTHESIS3 ? len - 2 : len - 1;
  let decoded = "";
  while (start < end && isWhiteSpace(str.charCodeAt(start))) {
    start++;
  }
  while (start < end && isWhiteSpace(str.charCodeAt(end))) {
    end--;
  }
  for (let i = start; i <= end; i++) {
    let code2 = str.charCodeAt(i);
    if (code2 === REVERSE_SOLIDUS2) {
      if (i === end) {
        if (i !== len - 1) {
          decoded = str.substr(i + 1);
        }
        break;
      }
      code2 = str.charCodeAt(++i);
      if (isValidEscape(REVERSE_SOLIDUS2, code2)) {
        const escapeStart = i - 1;
        const escapeEnd = consumeEscaped(str, escapeStart);
        i = escapeEnd - 1;
        decoded += decodeEscaped(str.substring(escapeStart + 1, escapeEnd));
      } else {
        if (code2 === 13 && str.charCodeAt(i + 1) === 10) {
          i++;
        }
      }
    } else {
      decoded += str[i];
    }
  }
  return decoded;
}
function encode2(str) {
  let encoded = "";
  let wsBeforeHexIsNeeded = false;
  for (let i = 0; i < str.length; i++) {
    const code2 = str.charCodeAt(i);
    if (code2 === 0) {
      encoded += "\uFFFD";
      continue;
    }
    if (code2 <= 31 || code2 === 127) {
      encoded += "\\" + code2.toString(16);
      wsBeforeHexIsNeeded = true;
      continue;
    }
    if (code2 === SPACE3 || code2 === REVERSE_SOLIDUS2 || code2 === QUOTATION_MARK2 || code2 === APOSTROPHE3 || code2 === LEFTPARENTHESIS3 || code2 === RIGHTPARENTHESIS3) {
      encoded += "\\" + str.charAt(i);
      wsBeforeHexIsNeeded = false;
    } else {
      if (wsBeforeHexIsNeeded && isHexDigit(code2)) {
        encoded += " ";
      }
      encoded += str.charAt(i);
      wsBeforeHexIsNeeded = false;
    }
  }
  return "url(" + encoded + ")";
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Url.js
var name38 = "Url";
var structure38 = {
  value: String
};
function parse39() {
  const start = this.tokenStart;
  let value;
  switch (this.tokenType) {
    case Url:
      value = decode2(this.consume(Url));
      break;
    case Function2:
      if (!this.cmpStr(this.tokenStart, this.tokenEnd, "url(")) {
        this.error("Function name must be `url`");
      }
      this.eat(Function2);
      this.skipSC();
      value = decode(this.consume(String2));
      this.skipSC();
      if (!this.eof) {
        this.eat(RightParenthesis);
      }
      break;
    default:
      this.error("Url or Function is expected");
  }
  return {
    type: "Url",
    loc: this.getLocation(start, this.tokenStart),
    value
  };
}
function generate39(node) {
  this.token(Url, encode2(node.value));
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/Value.js
var Value_exports = {};
__export(Value_exports, {
  generate: () => generate40,
  name: () => name39,
  parse: () => parse40,
  structure: () => structure39
});
var name39 = "Value";
var structure39 = {
  children: [[]]
};
function parse40() {
  const start = this.tokenStart;
  const children = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate40(node) {
  this.children(node);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/WhiteSpace.js
var WhiteSpace_exports = {};
__export(WhiteSpace_exports, {
  generate: () => generate41,
  name: () => name40,
  parse: () => parse41,
  structure: () => structure40
});
var SPACE4 = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
});
var name40 = "WhiteSpace";
var structure40 = {
  value: String
};
function parse41() {
  this.eat(WhiteSpace);
  return SPACE4;
}
function generate41(node) {
  this.token(WhiteSpace, node.value);
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/config/lexer.js
var lexer_default = {
  generic: true,
  ...data_default,
  node: node_exports
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/scope/index.js
var scope_exports = {};
__export(scope_exports, {
  AtrulePrelude: () => atrulePrelude_default,
  Selector: () => selector_default,
  Value: () => value_default
});

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/scope/default.js
var NUMBERSIGN4 = 35;
var ASTERISK6 = 42;
var PLUSSIGN9 = 43;
var HYPHENMINUS7 = 45;
var SOLIDUS5 = 47;
var U2 = 117;
function defaultRecognizer(context) {
  switch (this.tokenType) {
    case Hash:
      return this.Hash();
    case Comma:
      return this.Operator();
    case LeftParenthesis:
      return this.Parentheses(this.readSequence, context.recognizer);
    case LeftSquareBracket:
      return this.Brackets(this.readSequence, context.recognizer);
    case String2:
      return this.String();
    case Dimension:
      return this.Dimension();
    case Percentage:
      return this.Percentage();
    case Number2:
      return this.Number();
    case Function2:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, context.recognizer);
    case Url:
      return this.Url();
    case Ident:
      if (this.cmpChar(this.tokenStart, U2) && this.cmpChar(this.tokenStart + 1, PLUSSIGN9)) {
        return this.UnicodeRange();
      } else {
        return this.Identifier();
      }
    case Delim: {
      const code2 = this.charCodeAt(this.tokenStart);
      if (code2 === SOLIDUS5 || code2 === ASTERISK6 || code2 === PLUSSIGN9 || code2 === HYPHENMINUS7) {
        return this.Operator();
      }
      if (code2 === NUMBERSIGN4) {
        this.error("Hex or identifier is expected", this.tokenStart + 1);
      }
      break;
    }
  }
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/scope/atrulePrelude.js
var atrulePrelude_default = {
  getNode: defaultRecognizer
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/scope/selector.js
var NUMBERSIGN5 = 35;
var ASTERISK7 = 42;
var PLUSSIGN10 = 43;
var SOLIDUS6 = 47;
var FULLSTOP3 = 46;
var GREATERTHANSIGN3 = 62;
var VERTICALLINE4 = 124;
var TILDE3 = 126;
function onWhiteSpace(next, children) {
  if (children.last !== null && children.last.type !== "Combinator" && next !== null && next.type !== "Combinator") {
    children.push({
      type: "Combinator",
      loc: null,
      name: " "
    });
  }
}
function getNode() {
  switch (this.tokenType) {
    case LeftSquareBracket:
      return this.AttributeSelector();
    case Hash:
      return this.IdSelector();
    case Colon:
      if (this.lookupType(1) === Colon) {
        return this.PseudoElementSelector();
      } else {
        return this.PseudoClassSelector();
      }
    case Ident:
      return this.TypeSelector();
    case Number2:
    case Percentage:
      return this.Percentage();
    case Dimension:
      if (this.charCodeAt(this.tokenStart) === FULLSTOP3) {
        this.error("Identifier is expected", this.tokenStart + 1);
      }
      break;
    case Delim: {
      const code2 = this.charCodeAt(this.tokenStart);
      switch (code2) {
        case PLUSSIGN10:
        case GREATERTHANSIGN3:
        case TILDE3:
        case SOLIDUS6:
          return this.Combinator();
        case FULLSTOP3:
          return this.ClassSelector();
        case ASTERISK7:
        case VERTICALLINE4:
          return this.TypeSelector();
        case NUMBERSIGN5:
          return this.IdSelector();
      }
      break;
    }
  }
}
var selector_default = {
  onWhiteSpace,
  getNode
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/function/expression.js
function expression_default() {
  return this.createSingleNodeList(this.Raw(this.tokenIndex, null, false));
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/function/var.js
function var_default() {
  const children = this.createList();
  this.skipSC();
  children.push(this.Identifier());
  this.skipSC();
  if (this.tokenType === Comma) {
    children.push(this.Operator());
    const startIndex = this.tokenIndex;
    const value = this.parseCustomProperty ? this.Value(null) : this.Raw(this.tokenIndex, this.consumeUntilExclamationMarkOrSemicolon, false);
    if (value.type === "Value" && value.children.isEmpty) {
      for (let offset = startIndex - this.tokenIndex; offset <= 0; offset++) {
        if (this.lookupType(offset) === WhiteSpace) {
          value.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
      }
    }
    children.push(value);
  }
  return children;
}

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/scope/value.js
function isPlusMinusOperator(node) {
  return node !== null && node.type === "Operator" && (node.value[node.value.length - 1] === "-" || node.value[node.value.length - 1] === "+");
}
var value_default = {
  getNode: defaultRecognizer,
  onWhiteSpace: function(next, children) {
    if (isPlusMinusOperator(next)) {
      next.value = " " + next.value;
    }
    if (isPlusMinusOperator(children.last)) {
      children.last.value += " ";
    }
  },
  "expression": expression_default,
  "var": var_default
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/atrule/font-face.js
var font_face_default = {
  parse: {
    prelude: null,
    block() {
      return this.Block(true);
    }
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/atrule/import.js
var import_default3 = {
  parse: {
    prelude() {
      const children = this.createList();
      this.skipSC();
      switch (this.tokenType) {
        case String2:
          children.push(this.String());
          break;
        case Url:
        case Function2:
          children.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      if (this.lookupNonWSType(0) === Ident || this.lookupNonWSType(0) === LeftParenthesis) {
        children.push(this.MediaQueryList());
      }
      return children;
    },
    block: null
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/atrule/media.js
var media_default = {
  parse: {
    prelude() {
      return this.createSingleNodeList(this.MediaQueryList());
    },
    block() {
      return this.Block(false);
    }
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/atrule/page.js
var page_default = {
  parse: {
    prelude() {
      return this.createSingleNodeList(this.SelectorList());
    },
    block() {
      return this.Block(true);
    }
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/atrule/supports.js
function consumeRaw6() {
  return this.createSingleNodeList(this.Raw(this.tokenIndex, null, false));
}
function parentheses() {
  this.skipSC();
  if (this.tokenType === Ident && this.lookupNonWSType(1) === Colon) {
    return this.createSingleNodeList(this.Declaration());
  }
  return readSequence2.call(this);
}
function readSequence2() {
  const children = this.createList();
  let child;
  this.skipSC();
  scan:
    while (!this.eof) {
      switch (this.tokenType) {
        case Comment:
        case WhiteSpace:
          this.next();
          continue;
        case Function2:
          child = this.Function(consumeRaw6, this.scope.AtrulePrelude);
          break;
        case Ident:
          child = this.Identifier();
          break;
        case LeftParenthesis:
          child = this.Parentheses(parentheses, this.scope.AtrulePrelude);
          break;
        default:
          break scan;
      }
      children.push(child);
    }
  return children;
}
var supports_default = {
  parse: {
    prelude() {
      const children = readSequence2.call(this);
      if (this.getFirstListNode(children) === null) {
        this.error("Condition is expected");
      }
      return children;
    },
    block() {
      return this.Block(false);
    }
  }
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/atrule/index.js
var atrule_default = {
  "font-face": font_face_default,
  "import": import_default3,
  media: media_default,
  page: page_default,
  supports: supports_default
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/pseudo/index.js
var selectorList = {
  parse() {
    return this.createSingleNodeList(this.SelectorList());
  }
};
var selector = {
  parse() {
    return this.createSingleNodeList(this.Selector());
  }
};
var identList = {
  parse() {
    return this.createSingleNodeList(this.Identifier());
  }
};
var nth = {
  parse() {
    return this.createSingleNodeList(this.Nth());
  }
};
var pseudo_default = {
  "dir": identList,
  "has": selectorList,
  "lang": identList,
  "matches": selectorList,
  "is": selectorList,
  "-moz-any": selectorList,
  "-webkit-any": selectorList,
  "where": selectorList,
  "not": selectorList,
  "nth-child": nth,
  "nth-last-child": nth,
  "nth-last-of-type": nth,
  "nth-of-type": nth,
  "slotted": selector
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/node/index-parse.js
var index_parse_exports = {};
__export(index_parse_exports, {
  AnPlusB: () => parse2,
  Atrule: () => parse3,
  AtrulePrelude: () => parse4,
  AttributeSelector: () => parse5,
  Block: () => parse6,
  Brackets: () => parse7,
  CDC: () => parse8,
  CDO: () => parse9,
  ClassSelector: () => parse10,
  Combinator: () => parse11,
  Comment: () => parse12,
  Declaration: () => parse13,
  DeclarationList: () => parse14,
  Dimension: () => parse15,
  Function: () => parse16,
  Hash: () => parse17,
  IdSelector: () => parse19,
  Identifier: () => parse18,
  MediaFeature: () => parse20,
  MediaQuery: () => parse21,
  MediaQueryList: () => parse22,
  Nth: () => parse23,
  Number: () => parse24,
  Operator: () => parse25,
  Parentheses: () => parse26,
  Percentage: () => parse27,
  PseudoClassSelector: () => parse28,
  PseudoElementSelector: () => parse29,
  Ratio: () => parse30,
  Raw: () => parse31,
  Rule: () => parse32,
  Selector: () => parse33,
  SelectorList: () => parse34,
  String: () => parse35,
  StyleSheet: () => parse36,
  TypeSelector: () => parse37,
  UnicodeRange: () => parse38,
  Url: () => parse39,
  Value: () => parse40,
  WhiteSpace: () => parse41
});

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/config/parser.js
var parser_default = {
  parseContext: {
    default: "StyleSheet",
    stylesheet: "StyleSheet",
    atrule: "Atrule",
    atrulePrelude: function(options) {
      return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
    },
    mediaQueryList: "MediaQueryList",
    mediaQuery: "MediaQuery",
    rule: "Rule",
    selectorList: "SelectorList",
    selector: "Selector",
    block: function() {
      return this.Block(true);
    },
    declarationList: "DeclarationList",
    declaration: "Declaration",
    value: "Value"
  },
  scope: scope_exports,
  atrule: atrule_default,
  pseudo: pseudo_default,
  node: index_parse_exports
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/config/walker.js
var walker_default = {
  node: node_exports
};

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/syntax/index.js
var syntax_default = create_default({
  ...lexer_default,
  ...parser_default,
  ...walker_default
});

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/version.js
var import_module3 = require("module");
var import_meta3 = {};
var require4 = (0, import_module3.createRequire)(import_meta3.url);
var { version } = require4("../package.json");

// node_modules/.pnpm/css-tree@2.1.0/node_modules/css-tree/lib/index.js
var {
  tokenize: tokenize2,
  parse: parse42,
  generate: generate42,
  lexer,
  createLexer,
  walk: walk2,
  find,
  findLast,
  findAll,
  toPlainObject,
  fromPlainObject,
  fork
} = syntax_default;

// plugins/helper.ts
var import_crypto = require("crypto");
var import_buffer = require("buffer");
function interpolatePattern(string, replacer) {
  let result = "";
  let rest = string;
  while (rest !== "") {
    let match = rest.match(/(\[.+?\])/);
    if (match != null) {
      const text = match[0];
      const index = match.index ?? 0;
      let match1 = text.match(/&\[(.+)\]$/);
      if (match1 == null) {
        throw new Error("Unexpected case");
      }
      let [name41, ...params] = match1[1].split(":");
      const replacedString = replacer(name41, params);
      result += rest.substr(0, index) + (replacedString == null ? text : replacedString);
      rest = rest.substr(index + text.length);
    } else {
      result += rest;
      rest = "";
    }
  }
  return result;
}
function escapeClassName(string) {
  return string.replace(/^[^a-zA-Z_]/g, "").replace(/[^a-zA-Z0-9_-]/g, "-");
}
var SUPPORTED_HASHES = ["md4", "md5", "sha256", "sha512"];
var SUPPORTED_DIGESTS = ["hex", "base64"];
function isSupportedHashType(raw) {
  return SUPPORTED_HASHES.indexOf(raw) !== -1;
}
function isSupportedHashDigest(raw) {
  return SUPPORTED_DIGESTS.indexOf(raw) !== -1;
}
function makeNameHash(name41, maxLength = 32, type = "md4", digest = "hex") {
  const buffer = import_buffer.Buffer.from(name41, "utf8");
  const hash = (0, import_crypto.createHash)(type);
  hash.update(buffer);
  return `h${hash.digest(digest).substr(0, maxLength)}`;
}

// plugins/cssModulePlugin.ts
var writeFile = import_util.default.promisify(import_fs_extra.default.writeFile);
var readFile = import_util.default.promisify(import_fs_extra.default.readFile);
var ensureDir = import_util.default.promisify(import_fs_extra.default.ensureDir);
var cssModulePlugin_default = (options = {}) => ({
  name: "css-modules",
  setup(build) {
    const { extension = ".module.css", localIdentName = "[hash]" } = options;
    const rootDir = process.cwd();
    const filter = new RegExp(`./.+${extension.replace(/\./g, "\\.")}$`);
    const tmpDirPath = import_tmp.default.dirSync().name;
    build.onLoad({ filter }, async (args) => {
      const relativeDir = import_path.default.relative(rootDir, import_path.default.dirname(args.path));
      const fileContent = await readFile(args.path);
      const baseName = import_path.default.basename(args.path, extension);
      const folderName = import_path.default.basename(import_path.default.dirname(args.path));
      const extName = extension;
      const preparedLocalIdentName = interpolatePattern(localIdentName, (name41) => {
        switch (name41) {
          case "ext":
            return escapeClassName(extName);
          case "name":
            return escapeClassName(baseName);
          case "path":
            return escapeClassName(args.path);
          case "folder":
            return escapeClassName(folderName);
        }
        return null;
      });
      const ast = parse42(fileContent.toString());
      const classMap = {};
      walk2(ast, {
        visit: "ClassSelector",
        enter(node) {
          const newClassname = interpolatePattern(preparedLocalIdentName, (name41, params) => {
            switch (name41) {
              case "local":
                return node.name;
              case "hash": {
                const [lengthRaw, hashType, digestType] = params;
                if (hashType !== void 0 && !isSupportedHashType(hashType)) {
                  throw new Error(`Hash algorithm is not supported: ${hashType}. Supported algorithms: ${SUPPORTED_HASHES.join(", ")}`);
                }
                if (digestType !== void 0 && !isSupportedHashDigest(digestType)) {
                  throw new Error(`Digest type is not supported: ${digestType}. Supported digests: ${SUPPORTED_DIGESTS.join(", ")}`);
                }
                const length = parseInt(lengthRaw) || void 0;
                return makeNameHash(args.path + ":" + node.name, length, hashType, digestType);
              }
            }
            return null;
          });
          classMap[node.name] = newClassname;
          node.name = newClassname;
        }
      });
      const baseFileName = import_path.default.basename(args.path, extension);
      const tmpFilePath = import_path.default.resolve(tmpDirPath, relativeDir, `${baseFileName}.css`);
      await ensureDir(import_path.default.dirname(tmpFilePath));
      await writeFile(tmpFilePath, generate42(ast));
      let contents = `
        import "${tmpFilePath}";
        const result = ${JSON.stringify(classMap)};
        export default result;
      `;
      return {
        contents
      };
    });
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*!
 * Tmp
 *
 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */
