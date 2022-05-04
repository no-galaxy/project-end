function ajax(options) {
  // 存储的是默认值
  var defaults = {
    type: "get",
    url: "",
    date: {},
    header: {
      "Content-Type": "aplication/x-www-form-urlencoded",
      // 'Content-Type': 'application/json'
    },
    success: function () {},
    error: function () {},
  };
  // 使用options对象中的属性覆盖defaults对象中的属性
  Object.assign(defaults, options);
  // 创建ajax对象
  var xhr = new XMLHttpRequest();
  // 拼接请求参数的变量
  var params = "";

  for (let attr in defaults.data) {
    params += attr + "=" + defaults.data[attr] + "&";
  }
  // 将字符最后的&截取掉 并重新赋值给paramas变量
  params = params.substr(0, params.length - 1);

  // 判断请求方式
  if (defaults.type == "get") {
    defaults.url = defaults.url + "?" + params;
  }
  // 配置ajax对象
  xhr.open(defaults.type, defaults.url);
  // 如果请求方式为post
  if (defaults.type == "post") {
    
    // 用户希望向服务器端返回的类型
    var contentType = defaults.header["Content-Type"];
    if (contentType == '') {
      xhr.send(defaults.data)
    }
    // 设置请求体的类型
    else {
    xhr.setRequestHeader("Content-Type", contentType);
    // 判断用户希望传递的参数的类型
    if (contentType == "application/json") {
      // 向服务器端传递的时json数据类型
      xhr.send(JSON.stringify(defaults.data));
    } 
    else {
      // 向服务器传递
      xhr.send(params);
    } }
  } else {
    // 发送请求
    xhr.send();
  }

  // 监听xhr对象下面的onload事件
  xhr.onload = function () {
    // xhr.getResponseHeader()
    // 获取响应头中的数据
    var contentType = xhr.getResponseHeader("Content-Type");
    var responseText = xhr.responseText;
    // 判断是否含有json类型数据
    if (contentType.includes("application/json")) {
      // 将json字符串转换为json对象
      responseText = JSON.parse(responseText);
    }

    // 当为200时成功
    if (xhr.status == 200) {
      // 请求成功 调用处理成功时的函数
      defaults.success(responseText, xhr);
    } else {
      // 请求失败 调用处理失败时的函数
      defaults.error(responseText, xhr);
    }
  };
}
