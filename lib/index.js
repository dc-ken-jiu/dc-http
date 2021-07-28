"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DCHttp = /*#__PURE__*/function () {
  function DCHttp(_config) {
    var _this = this;

    _classCallCheck(this, DCHttp);

    _defineProperty(this, "baseGet", function (url) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      config.params = value;
      return _this.baseRequest("get", url, config);
    });

    _defineProperty(this, "basePost", function (url, value) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.baseRequest("post", url, value, config);
    });

    _defineProperty(this, "basePut", function (url, value) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.baseRequest("put", url, value, config);
    });

    _defineProperty(this, "baseDelete", function (url, value) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.baseRequest("delete", url, value, config);
    });

    _defineProperty(this, "baseXWwwFormPost", function (url, value) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      config.headers["content-type"] = "application/x-www-form-urlencoded";
      config.data = _qs["default"].stringify(value);
      return _this.baseRequest("post", url, value, config);
    });

    //请求拦截器
    this.interceptorsRequest = ""; //响应拦截器

    this.interceptorsResponse = ""; //响应策略

    this.strategy = ""; //初始化

    this.init(_config);
  }
  /**
   * 初始化,处理config参数,创建axios实例
   */


  _createClass(DCHttp, [{
    key: "init",
    value: function init(config) {
      this.handStrategy(config);
      this.config = this.handleConfig(config);
      this.axios = this.addInterceptors();
    }
    /**
     * 
     * 处理策略值
     */

  }, {
    key: "handStrategy",
    value: function handStrategy(config) {
      if (typeof config.strategy == "function") {
        this.strategy = config.strategy;
      } else {
        this.strategy = /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(p) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", p);

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }();
      }
    }
    /**
     * 处理config参数
     */

  }, {
    key: "handleConfig",
    value: function handleConfig(config) {
      //处理拦截器
      var interceptorsRequest = config.interceptorsRequest,
          interceptorsResponse = config.interceptorsResponse;
      var interceptor = {
        interceptorsRequest: interceptorsRequest,
        interceptorsResponse: interceptorsResponse
      };
      Object.keys(interceptor).map(function (key) {
        var item = config[key];

        if (item) {
          if (!("success" in item)) {
            item["success"] = function (config) {
              // 在发送请求之前做些什么
              return config;
            };
          }

          if (!("error" in item)) {
            item["error"] = function (error) {
              // 对请求错误做些什么
              return Promise.reject(error);
            };
          }

          delete config[key];
        }
      });
      this.interceptorsRequest = interceptorsRequest || "";
      this.interceptorsResponse = interceptorsResponse || "";
      return config;
    }
    /**
     * 
     * 增加拦截器
     */

  }, {
    key: "addInterceptors",
    value: function addInterceptors() {
      var instance = _axios["default"].create(this.config);

      if (this.interceptorsRequest) {
        var _this$interceptorsReq = this.interceptorsRequest,
            success = _this$interceptorsReq.success,
            error = _this$interceptorsReq.error;
        instance.interceptors.request.use(success, error);
      }

      if (this.interceptorsResponse) {
        var _this$interceptorsRes = this.interceptorsResponse,
            _success = _this$interceptorsRes.success,
            _error = _this$interceptorsRes.error;
        instance.interceptors.response.use(_success, _error);
      }

      return instance;
    }
  }, {
    key: "baseRequest",
    value: function baseRequest(type, url) {
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var _config2 = config,
          noEffect = _config2.noEffect;
      if (noEffect) delete config.noEffect;
      config = Object.assign({
        url: url,
        method: type,
        data: value
      }, config);
      var p = this.axios.request(config); //策略是否启用

      if (!noEffect) {
        return this.strategy(p);
      } else {
        return p;
      }
    }
    /**
     * @param {*} url
     * 使用get
     */

  }, {
    key: "getAxios",
    value:
    /**
     * 获取原生axios
     */
    function getAxios() {
      return _axios["default"];
    }
  }]);

  return DCHttp;
}();

module.exports = DCHttp;