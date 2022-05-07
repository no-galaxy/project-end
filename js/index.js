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
    age: localStorage.getItem('age'),
    phone: localStorage.getItem('phone'),
    sex: localStorage.getItem('sex')
};
// 设置一个通用的ajax发送请求的对象 后面需要加success函数
var sendObj = {
    type: "post",
    header: {
    "Content-Type": "application/json",
},
 data: {}
}
// 开灯关灯
let onOff = document.querySelector('.on-off');
onOff.onclick = function() {
  let as = document.querySelectorAll('a')
  if(this.innerHTML == '关灯') {
    document.body.className = 'off';
    this.innerHTML = '开灯';
    for(let i = 0; i < as.length; i++) {
      as[i].style.color = 'white'
    }
  } else {
    document.body.className = 'on';
    this.innerHTML = '关灯';
    for(let i = 0; i < as.length; i++) {
      as[i].style.color = 'black'
    }
    
  }
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
spans[4].innerHTML = '电话：' + userinfo.phone;
spans[5].innerHTML = '性别：' + userinfo.sex;
spans[6].innerHTML = '年龄：' + userinfo.age;
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
// 动态删除函数
function deleteContentTab(data, x) {
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
  } else {
    if(x.children[1] != undefined) {
      for(let i = 0; i < x.children.length; i++) {
        x.removeChild(x.children[1]);
      }
  }
  }
}
// 动态添加函数
function addContentTab(data,x) {
  if(data instanceof Array) {
  for(let i = 0; i < data.length; i++) {
    let major = '<div class="major"> \
    <div class="content-username"> \
        <img src=' + imgdomain + data[i].author.headImg +' alt=""> \
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
        <p>^下拉或收起</p>\
        <img src="images/评论.png" alt=""> \
        <img src="images/点赞.png" alt="" class="give-like"> \
        <a href="javascript:;">'+ data[i].likesNum+'</a> \
    </div> \
</div>'
    x.insertAdjacentHTML('beforeend', major);
    for(let j = 0; j < data[i].images.length; j++) {
      let contentText = x.querySelector('.index'+ i +'');
      let images =  '<img src='+ imgdomain + data[i].images[j].img +' alt=""></img>'
      contentText.insertAdjacentHTML('beforeend', images);
  }
  }
} else {
  let major = '<div class="major"> \
    <div class="content-username"> \
        <img src=' + imgdomain + data.author.headImg +' alt=""> \
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
        <p>^下拉或收起</p>\
        <img src="images/评论.png" alt=""> \
        <img src="images/点赞.png" alt="" class="give-like"> \
        <a href="javascript:;">'+ data.likesNum +'</a> \
    </div> \
</div>'
    x.insertAdjacentHTML('beforeend', major);
    let contentText = x.querySelector('.content-text');
    for(let j = 0; j < data.images.length; j++) {
      let images =  '<img src='+ imgdomain + data.images[j].img +' alt=""></img>'
      contentText.insertAdjacentHTML('beforeend', images);
  }
}
}
// 展开详细信息或这收起详细信息
function spreadTrend(x) {
          let h2s = x.querySelectorAll('h2');
          let ps = x.querySelectorAll('p');
          for(let i = 0; i < h2s.length; i++) {
            h2s[i].onclick = function() {
          this.nextElementSibling.className = 'text-spread';
            }
          }
          for(let j = 0; j < ps.length; j++) {
            ps[j].onclick = function() {
             this.parentNode.previousElementSibling.children[1].className = 'text';
            }
          }
}
// 点赞取消点赞
function giveLike(data, x) {
      let givelks = x.querySelectorAll('.give-like');
      sendObj.url = urldomain + "175.178.51.126:8091/smallA/likeDiary";
      if(data instanceof Array) {
      for(let i = 0; i < givelks.length; i++) {
        let that = data[i].isLike;
        let likeNum = data[i].likesNum;
        givelks[i].addEventListener('click',function() {
          if(that == false) {
            sendObj.data = {
              uid: userinfo.id,
              id: data[i].id,
              ifLike: true
            }
            sendObj.success = (result, xhr) => {
              console.log(result);
              if(result.code == 200) {
                alert('点赞成功');
                that = true;
                givelks[i].nextElementSibling.innerHTML = likeNum + 1;
                likeNum += 1;
              } 
            }
            ajax(sendObj)
          } else {
              sendObj.data = {
                uid: userinfo.id,
                id: data[i].id,
                ifLike: false
            };
            sendObj.success = (result, xhr) => {
              console.log(result);
              if(result.code == 200) {
                alert('取消点赞成功')
                that = false;
                givelks[i].nextElementSibling.innerHTML =  likeNum - 1;
                likeNum -= 1;
              }
            }
            ajax(sendObj)
          }
        })
      }
    } else {
      let that = data.isLike;
        let likeNum = data.likesNum;
        givelks[0].addEventListener('click',function() {
          if(that == false) {
            sendObj.data = {
              uid: userinfo.id,
              id: data.id,
              ifLike: true
            }
            sendObj.success = (result, xhr) => {
              console.log(result);
              if(result.code == 200) {
                alert('点赞成功');
                that = true;
                givelks[0].nextElementSibling.innerHTML = likeNum + 1;
                likeNum += 1;
              } 
            }
            ajax(sendObj)
          } else {
              sendObj.data = {
                uid: userinfo.id,
                id: data.id,
                ifLike: false
            };
            sendObj.success = (result, xhr) => {
              console.log(result);
              if(result.code == 200) {
                alert('取消点赞成功')
                that = false;
                givelks[0].nextElementSibling.innerHTML =  likeNum - 1;
                likeNum -= 1;
              }
            }
            ajax(sendObj)
          }
        })
    }
}
// 动态添加相册
function addphotos(data, x) {
  if(data instanceof Array) {
  for(let i = 0; i < data.length; i++) {
    let major = '<div class="major"> \
    <div class="content-username"> \
    <img src=' + imgdomain + userinfo.headImg +' alt=""> \
        <span>'+ userinfo.username +'</span> \
        <span>相册id：'+ data[i].id +'</span> \
    </div> \
    <div class="content-text"> \
    <h2>'+ data[i].name+'</h2> \
        <div class="text">'+ data[i].introduction+'</div> \
    </div> \
    <form action="" id="form5"> \
                <input type="button" value="上传照片" name="send-img" id="send-img"> \
                <input type="file" multiple="multiple" id="imageFiles"> \
                <input type="button" value="删除照片" name="delete-img" id="delete-img"> \
            </form> \
</div>'
  x.insertAdjacentHTML('beforeend', major);
  }
} else {
  let major = '<div class="major"> \
    <div class="content-username">id:wu</div> \
    <div class="content-text"> \
    <h2>wu</h2> \
        <div class="text">wu</div> \
    </div> \
</div>'
  x.insertAdjacentHTML('beforeend', major);
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
          addContentTab(result.data, content);
          spreadTrend(content);
          giveLike(result.data, content);
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
// 全部动态
as[0].addEventListener('click', function() {
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
            deleteContentTab(result.data, sections[this.index]);
            addContentTab(result.data, sections[this.index]);
            spreadTrend(sections[this.index]);
            giveLike(result.data, sections[this.index]);
         } }
  })
})
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
            deleteContentTab(result.data, sections[this.index]);
            addContentTab(result.data, sections[this.index]);
            spreadTrend(sections[this.index]);
            giveLike(result.data, sections[this.index]);
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
              deleteContentTab(result.data, sections[1]);
              addContentTab(result.data, sections[1]);
              spreadTrend(sections[1]);
              giveLike(result.data, sections[1])
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
// 修改个人信息
  let userSpcinfo = document.getElementById('user-spcinfo');
  let reviseFun = document.getElementById('revise-info');
  let btnSub = document.getElementById('btn-sub');
  let btnClose = document.querySelector('#close')
  //显示输入框
  reviseFun.onclick = function() {
    userSpcinfo.style.display = 'block';
  }
  // 发送ajax请求
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
              alert('修改成功');
              localStorage.setItem('username', inputs[0].value);
              localStorage.setItem('email', inputs[1].value);
              localStorage.setItem('phone', inputs[2].value);
              localStorage.setItem('sex', inputs[3].value);
              localStorage.setItem('age', inputs[4].value);
              userinfo.username = localStorage.getItem('username');
              userinfo.email = localStorage.getItem('email');
              userinfo.phone = localStorage.getItem('phone');
              userinfo.sex = localStorage.getItem('sex');
              userinfo.age = localStorage.getItem('age');
              getUserInfo();
              userSpcinfo.style.display = 'none';
            }
          }
    })
  }
  // 隐藏输入框
  btnClose.onclick = function() {
    userSpcinfo.style.display = 'none'
  }
  // 删除动态
  let deleteTrend = document.getElementById('delete-trend');
  deleteTrend.onclick = function () {
    let deleteID = prompt('请输入要删除的动态的ID');
    sendObj.url = urldomain + "175.178.51.126:8091/smallA/deleteDiary"
    sendObj.data = { 
      id: deleteID
    };
    sendObj.success = function(result, xhr) {
      console.log(result);
      if(result.code == 200) {
        alert('删除成功');
        as[3].click();
        sections[3].removeChild(sections[3].children[1])
      } else {
        alert(result.msg)
      }
    };
    if(deleteID != undefined) {
    ajax(sendObj);
    }
  }
  // 发布动态
  // 获取元素
  let sendTrend = document.getElementById('sub-trends');
  let putTrend = document.getElementById('put-trend')
  let funBottom = document.querySelector('.fun-bottom');
  let cancle = document.getElementById('cancle')
  //显示文本框
  putTrend.onclick = function() {
    funBottom.style.display = 'block'
  }
  // 隐藏文本框 
  cancle.onclick = function() {
    funBottom.style.display = 'none'
  }
  // 发布动态
  sendTrend.onclick = function() {
    // 获取元素属性
    let title = document.getElementById('put-title').value;
    let content = document.getElementById('put-content').value;
    let imgFiles = document.getElementById('files');
    // 创建空表单对象
    let formData = new FormData();
    formData.append('uid', userinfo.id);
    formData.append('title', title);
    formData.append('content', content);
    for(let i = 0; i < imgFiles.files.length; i++) {
      formData.append('img', imgFiles.files[i])
    }
    ajax({
      type: "post",
          header: {
            "Content-Type": ""
          },
          url: urldomain + "175.178.51.126:8091/smallA/insertDiary",
          data: formData,
          success: (result, xhr) => {
            console.log(result);
            if(result.code == 200) {
              alert('发送成功')
              addContentTab(result.data, sections[3])
              spreadTrend(sections[3]);
              as[3].click();
            }
          }
    })
  }
  //  查询自身的id动态
  as[3].addEventListener('click', function() {
    ajax({
      type: "post",
          header: {
            "Content-Type": "application/json",
          },
          url: urldomain + "175.178.51.126:8091/smallA/selectDiaryByUserId",
          data: {
            uid: userinfo.id,
            id: userinfo.id
          },
          success: (result, xhr) => {
              console.log(result);
            if(result.code == 200) {
              deleteContentTab(result.data, sections[this.index]);
              addContentTab(result.data, sections[this.index])
              spreadTrend(sections[this.index]);
              giveLike(result.data, sections[this.index]);
           } }
    })
  })
// 个人相册内容
let putPhoto = document.getElementById('put-photo');
let photoCancle = document.getElementById('photo-cancle');
let photoBottom = document.querySelector('.photo-bottom');
let addPhoto = document.getElementById('sub-photo');
// 隐藏文本框
photoCancle.onclick = function() {
  photoBottom.style.display = 'none'
}
// 添加相册
addPhoto.onclick = function () {
  let photoName = document.getElementById('photo-name').value;
  let brief = document.getElementById('put-brief').value;
  ajax({
    type: "post",
    header: {
      "Content-Type": "application/json",
    },
    url: urldomain + "175.178.51.126:8091/smallA/insertAlbum",
    data: {
      uid: userinfo.id,
      name: photoName,
      introduction: brief
    },
    success: (result, xhr) => {
      console.log(result);
      if(result.code == 200) {
        alert('添加成功');
        addphotos(result.data, sections[4])
        as[4].click()
      }
    },
  })
}
// 显示文本框
putPhoto.onclick = function() {
  photoBottom.style.display = 'block'
}
// 删除相册
let deletePho = document.getElementById('delete-photo');
deletePho.onclick = function() {
  let photoID = prompt('请输入要删除的相册id');
  ajax({
    type: "post",
    header: {
      "Content-Type": "application/json",
    },
    url: urldomain + "175.178.51.126:8091/smallA/deleteAlbum",
    data: {
      id: photoID
    },
    success: (result, xhr) => {
      console.log(result);
      if(result.code == 200) {
        alert('删除成功')
        as[4].click();        
        sections[4].removeChild(sections[4].children[1])
      } else {
        alert(result.msg)
      }
    }
  })
}
// 查看个人相册
as[4].addEventListener('click', function() {
  ajax({
    type: "post",
    header: {
      "Content-Type": "application/json",
    },
    url: urldomain + "175.178.51.126:8091/smallA/selectAlbumByUid",
    data: {
      uid: userinfo.id
    },
    success: (result,xhr) => {
      if(result.code == 200) {
        console.log(result);
        deleteContentTab(result.data, sections[4]);
        addphotos(result.data, sections[4]);
        sendImage(result.data);
        deleteImage(result.data);
        showAlbum(result.data,sections[4]);
      }
    }
  })
})
// 上传照片
function sendImage(data) {
  let sendImg = document.querySelectorAll('#send-img');
  let imgFiles = document.querySelectorAll('#imageFiles');
  let formData = new FormData()
  formData.append('uid', userinfo.id)
  for(let i = 0; i < data.length; i++) {
    sendImg[i].onclick = function() {
     formData.append('aid', data[i].id)
     for(j = 0; j < imgFiles[i].files.length; j++) {
       formData.append('photo', imgFiles[i].files[j])
     }
     ajax({
      type: "post",
      header: {
        "Content-Type": ""
      },
      url: urldomain + "175.178.51.126:8091/smallA/uploadPhoto",
      data: formData,
      success: (result,xhr) => {
        console.log(result);
        if(result.code == 200) {
         alert('上传成功')
        } else {
          alert(result.msg)
        }
      }
     })
    }
  }
}
// 删除照片
function deleteImage(data) {
  let deleteimg = document.querySelectorAll('#delete-img')
  for(i = 0; i < data.length; i++) {
    deleteimg[i].onclick = function() {
      let photoID = prompt('请输入要删除的照片的ID')
      ajax({
        type: "post",
          header: {
            "Content-Type": "application/json",
          },
          url: urldomain + "175.178.51.126:8091/smallA/deletePhoto",
          data: {
            id: photoID
          },
          success: (result, xhr) => {
            console.log(result);
            if(result.code == 200) {
              alert('删除照片成功')
            } else {
              alert(result.msg)
            }
          }
      })
    }
  }
}
// 关闭照片框
let closeAlbum = document.getElementById('close-Album');
let userAlbum = document.getElementById('user-Album');
closeAlbum.onclick = function(){
  userAlbum.style.display = 'none'
}
// 添加照片到照片框
// 删除一些照片
function deleteShow() {
    if(userAlbum.children[5] != undefined) {
    for(let i = 1; i < userAlbum.children.length; i++) {
      userAlbum.removeChild(userAlbum.children[i])
  } 
}
}
function showAlbum(data,x) {
  let h2s = x.querySelectorAll('h2');
  for(let i = 0; i < h2s.length; i++) {
    h2s[i].onclick = function() {
      deleteShow();
      userAlbum.style.display = 'block'
      for(j = 0; j < data[i].photos.length; j++) {
      let spanAndimg = '<span>id:'+ data[i].photos[j].id +'</span> \
      <img src='+ imgdomain + data[i].photos[j].img +' alt="">'
      userAlbum.insertAdjacentHTML('beforeend', spanAndimg);
      }
    }
  }
}







