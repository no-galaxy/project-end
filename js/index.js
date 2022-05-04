// 用于接收后台的图片数据
const imgdomain = 'http://';
//用于添加前缀
const urldomain = 'http://';
// 用来存贮用户数据
var userinfo = {
    username: localStorage.getItem('username'),
    id: localStorage.getItem('id'),
    email: localStorage.getItem('email'),
    password: localStorage.getItem('password'),
    headImg: localStorage.getItem('headImg'),
};
// 设置一个通用的ajax发送请求的对象 后面需要加success函数
var sendObj = {
    type: "post",
    header: {
    "Content-Type": "application/json",
},
 data: {}
}
// 获取注销和修改密码按钮
let deleteBtn = document.getElementById('deleteUser');
let changeBtn = document.getElementById('change');
// 获取上传头像的input
let headImgFile = document.getElementById('file-headImg')
// 删除存储数据的函数
function deleteLocalData() {
    localStorage.removeItem('username')
    localStorage.removeItem('id')
    localStorage.removeItem('password')
    localStorage.removeItem('email')
    localStorage.removeItem('headImg')
}
// 获取用户数据的函数
function getUserInfo() {
let spans = document.querySelector('.top').getElementsByTagName('span');
let headImg = document.getElementById('headImg');
spans[0].innerHTML = 'id：' + userinfo.id;
spans[1].innerHTML = '用户名：' + userinfo.username;
spans[2].innerHTML = '密码：' + userinfo.password;
spans[3].innerHTML = '邮箱：' + userinfo.email;
headImg.src = imgdomain + userinfo.headImg;
}
getUserInfo();
//点击修改密码
changeBtn.onclick = function() {
  // 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)：
    let regPassword = /^[a-zA-Z]\w{6,16}$/;
    let newPassword = prompt('请输入新密码，以字母开头，长度在6~18之间，只能包含字母、数字和下划线');
    if(regPassword.test(newPassword)) {
        ajax({
            type: "post",
      header: {
        "Content-Type": "application/json",
      },
      url: urldomain + "175.178.51.126:8091/smallA/updatePwd",
      data: {
        username: userinfo.username,
        oldPassword: userinfo.password,
        newPassword: newPassword
      },
      success: (result, xhr) => {
          console.log(result);
        if(result.code == 200) {
            alert('修改成功');
            localStorage.setItem('password', newPassword);
            userinfo.password = localStorage.getItem('password');
            getUserInfo();
        } 
      }
        })
    } else if (newPassword == '' || newPassword == undefined) {
      return;
    }
    else {
        alert('请输入正确格式的密码');
}
}
// 点击注销
deleteBtn.onclick = function() {
    // 询问用户是否删除
    let flag = prompt('你真的要注销用户吗，请输入是或否')
    if(flag === '是') {
        ajax({
            type: "post",
            header: {
              "Content-Type": "application/json",
            },
            url: urldomain + "175.178.51.126:8091/smallA/deleteUser",
            data: {
              username: userinfo.username,
              password: userinfo.password,
              email: userinfo.email
            },
            success: (result, xhr) => {
                if(result.code == 200) {
                    alert('注销成功')
                    deleteLocalData();
                    window.location.href = "file:///C:/Users/pan'da'xie/Desktop/html/project/login%20and%20register.html";
                }
            }
        })
    }
}
// 上传头像
headImgFile.onchange = function() {
    let formData = new FormData();
    // 将用户的头像文件追加到formdata对象中
    formData.append('headImg', this.files[0]);
    formData.append('username', userinfo.username);
    console.log(formData.get('username'));
    ajax({
        type: "post",
      header: {
        "Content-Type": "",
      },
      url: urldomain + "175.178.51.126:8091/smallA/uploadHeadImg",
      data: formData,
      success: (result,xhr) => {
          if(result.code == 200) {
              console.log(result);
            localStorage.setItem('headImg', result.data);
            userinfo.headImg = localStorage.getItem('headImg');
            getUserInfo();
          }
      }
    })
}
// 获取元素 动态添加全部的动态
let content = document.querySelector('.content')
// 动态添加函数
function addContentTab(data,x) {
  if(data instanceof Array) {
    // 判断是否删除第一个盒子
    if(x.children[0] != undefined && x.children[1] != undefined) {
      if(x.children[2] == undefined) {
        x.removeChild(x.children[1]);
      } else {
      for(let i = 0; i < data.length; i++) {
      if(x.children[data.length - i] == undefined) {
        x.removeChild(x.children[0]);
      } else{
        x.removeChild(x.children[1]);
      } }
      } 
    }
  for(let i = 0; i < data.length; i++) {
    let major = '<div class="major"> \
    <div class="content-username"> \
        <img src=' + urldomain + data[i].author.headImg +' alt=""> \
        <span>'+ data[i].author.username +'</span> \
        <span>id：'+ data[i].author.id +'</span> \
</div> \
    <div class="content-text index'+ i + '"> \
        <h2>'+ data[i].title +'</h2> \
        <div class="text">'+ data[i].content +'</div> \
    </div> \
    <div class="timer"> \
        <span>发布时间为：'+ data[i].createTime + '</span> \
        <span>动态id： '+ data[i].id+'</span> \
        <img src="images/评论.png" alt=""> \
        <img src="images/点赞.png" alt=""> \
        <a href="">'+ data[i].likesNum+'</a> \
    </div> \
</div>'
    x.insertAdjacentHTML('beforeend', major);
    for(let j = 0; j < data[i].images.length; j++) {
      let contentText = x.querySelector('.index'+ i +'');
      let images =  '<img src='+ urldomain + data[i].images[j].img +' alt=""></img>'
      contentText.insertAdjacentHTML('beforeend', images);
  }
  }
} else {
  if(x.children[1] != undefined) {
      for(let i = 0; i < x.children.length; i++) {
        x.removeChild(x.children[1]);
      }
  }
  let major = '<div class="major"> \
    <div class="content-username"> \
        <img src=' + urldomain + data.author.headImg +' alt=""> \
        <span>'+ data.author.username +'</span> \
        <span>id：'+ data.author.id +'</span> \
</div> \
    <div class="content-text"> \
        <h2>'+ data.title +'</h2> \
        <div class="text">'+ data.content +'</div> \
    </div> \
    <div class="timer"> \
        <span>发布时间为：'+ data.createTime + '</span> \
        <span>动态id： '+ data.id+'</span> \
        <img src="images/评论.png" alt=""> \
        <img src="images/点赞.png" alt=""> \
        <a href="">'+ data.likesNum+'</a> \
    </div> \
</div>'
    x.insertAdjacentHTML('beforeend', major);
    let contentText = x.querySelector('.content-text');
    for(let j = 0; j < data.images.length; j++) {
      let images =  '<img src='+ urldomain + data.images[j].img +' alt=""></img>'
      contentText.insertAdjacentHTML('beforeend', images);
  }
}
}
ajax({
  type: "post",
      header: {
        "Content-Type": "application/json",
      },
      url: urldomain + "175.178.51.126:8091/smallA/selectAllDiary",
      data: {
        uid: userinfo.id,
      },
      success: (result, xhr) => {
          console.log(result);
        if(result.code == 200) {
          addContentTab(result.data, content)
       } }
})
// 获取切换tab栏的元素
var as = document.querySelector('.nav').querySelectorAll('a');
var h2 = document.querySelector('.content-header').querySelector('h2');
var sections = document.querySelectorAll('section');
for(let i = 0; i < as.length; i++) {
  as[i].index = i
  as[i].onclick = function() {
    h2.innerHTML = this.innerHTML
    for(let i = 0; i < sections.length; i++) {
      sections[i].className = '';
      sections[i].style.display = 'none'
    }
    sections[this.index].className = 'content'
    sections[this.index].style.display = 'block';
  }
}
// 切换tab栏结束
// 热门动态
as[2].addEventListener('click', function() {
  ajax({
    type: "post",
        header: {
          "Content-Type": "application/json",
        },
        url: urldomain + "175.178.51.126:8091/smallA/selectHotDiary",
        data: {
          uid: userinfo.id,
        },
        success: (result, xhr) => {
            console.log(result);
          if(result.code == 200) {
            addContentTab(result.data, sections[this.index])
         } }
  })
})
// 搜索框内容
var searchBtn = document.querySelector('.search-id');
searchBtn.onclick = function() {
    let searchValue = document.querySelector('#search').value;
    let searchSend = {
      type: "post",
          header: {
            "Content-Type": "application/json",
          },
          url: urldomain + "175.178.51.126:8091/smallA/selectDiary",
          data: {
            uid: userinfo.id,
            id: searchValue,
          },
          success: (result, xhr) => {
              console.log(result);
            if(result.code == 200) { 
              if(result.data != null) {
              addContentTab(result.data, sections[1])
              } else {
                alert('该动态不存在')
              }
           } },
    }
    // 正则表达式判断是否为数字
    let regNumber = /^[1-9]\d*$/
    if (regNumber.test(searchValue)) {
    ajax(searchSend);
    } else {
      delete searchSend.data.id;
      searchSend.data.key = searchValue;
      ajax(searchSend);
    }
}
// 修改和查看个人信息
  let userSpcinfo = document.getElementById('user-spcinfo');
  let reviseFun = document.getElementById('revise-info');
  let btnSub = document.getElementById('btn-sub');
  let btnClose = document.querySelector('#close')
  reviseFun.onclick = function() {
    userSpcinfo.style.display = 'block';
  }
  btnSub.onclick = function() {
    let inputs = document.getElementById('form2').querySelectorAll('input')
    ajax({
      type: "post",
          header: {
            "Content-Type": "application/json",
          },
          url: urldomain + "175.178.51.126:8091/smallA/updateUserData",
          data: {
            id: userinfo.id,
            username: inputs[0].value,
            email: inputs[1].value,
            phone: inputs[2].value,
            sex: inputs[3].value,
            age: inputs[4].value,
          },
          success: (result, xhr) => {
            console.log(result);
            if(result.code == 200) {

            }
          }
    })
  }
  btnClose.onclick = function() {
    userSpcinfo.style.display = 'none'
  }
  





