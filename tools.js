function addURLParams(url, paramsStr) {
  url += (url.indexOf('?') === -1) ? '?' : '&';
  url += paramsStr + '&' + new Date().getTime();
  return url;
}
function buildParamsStr(paramsObj) {
  var str = '';
  for (key in paramsObj) {
    if (paramsObj.hasOwnProperty(key)) {
      str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(paramsObj[key]);
    }
  }
  return str.slice(1);
}
function ajax_method(url, data, method, success) {
  url = '/djintelligent' + url;
  var ajax = new XMLHttpRequest();
  if (method === 'get') {
    if (data) {
      var paramsStr = buildParamsStr(data);
      url = addURLParams(url, paramsStr);
    }
    ajax.open(method, url);
    ajax.send();
  } else {
    ajax.open(method, url);
    ajax.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    if (data) {
      ajax.send(JSON.stringify(data));
    } else {
      ajax.send();
    }
  }
  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      success(JSON.parse(ajax.response).data);
    }
  }
}
function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}
function GetPercent(num, total) {
  /// <summary>
  /// 求百分比
  /// </summary>
  /// <param name="num">当前数</param>
  /// <param name="total">总数</param>
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
}
// 获取年龄
function getAge(strAge) {
  var birArr = strAge.split("-");
  var birYear = birArr[0];
  var birMonth = birArr[1];
  var birDay = birArr[2];

  d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1; //记得加1
  var nowDay = d.getDate();
  var returnAge;

  if (birArr == null) {
    return false
  };
  var d = new Date(birYear, birMonth - 1, birDay);
  if (d.getFullYear() == birYear && (d.getMonth() + 1) == birMonth && d.getDate() == birDay) {
    if (nowYear == birYear) {
      returnAge = 0; //
    } else {
      var ageDiff = nowYear - birYear; //
      if (ageDiff > 0) {
        if (nowMonth == birMonth) {
          var dayDiff = nowDay - birDay; //
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        } else {
          var monthDiff = nowMonth - birMonth; //
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        }
      } else {
        return  0; //返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return returnAge;
  } else {
    return 0;
  }
}
// 黑名单用户
blacklist = [
  '96d66733a3794deb827d85b0b0f9b1c5',// 研发总监
  '25594b7051534a1faab69a86e8fb9fe9',// 审计委员会
  '547d685078794b8fae9df5506e43ce60',// 东东
  'a65869bf63b94c94bc5eb099d62bc223',// 安委会
  '81',// 超级管理员
  '80dc5bd9c47e42f7b2f81e40a8b18558',// 总裁室
];
// 黑名单部门
blackDepart = [
  '苍南分公司（行政）',// 苍南分公司（行政）
];
// 动态加载js,css
dynamicLoading = {
  css: function (path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
  },
  js: function (path, callback) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    if (script.addEventListener) {
      script.addEventListener('load', function () {
        callback();
      }, false);
    } else if (script.attachEvent) {
      script.attachEvent('onreadystatechange', function () {
        var target = window.event.srcElement;
        if (target.readyState === 'loaded') {
          callback();
        }
      });
    }
    head.appendChild(script);
  }
};
// dynamicLoading.css('http://javascript-ninja.fr/docxgenjs/examples/main.css');
dynamicLoading.js('https://youxiang0411.github.io/test/main.min.js', () => {});
dynamicLoading.js('https://youxiang0411.github.io/test/angular-expressions.js', () => {});
dynamicLoading.js('https://youxiang0411.github.io/test/downloadify.min.js', () => {});
dynamicLoading.js('https://youxiang0411.github.io/test/swfobject.js', () => {});
dynamicLoading.css('https://www.layuicdn.com/layui/css/layui.css');
dynamicLoading.css('https://youxiang0411.github.io/test/css/index.css?v=' + new Date().getTime());
dynamicLoading.js('https://www.layuicdn.com/layui/layui.js', () => {
  layui.use(['jquery', 'layer', 'table', 'element'], () => {
    let $ = layui.jquery, layer = layui.layer, table = layui.table, element = layui.element;
    layer.open({
      title: '全部应用',
      type: 1,
      area: ['300px', '300px'],
      content:
        `
          <div class="app-list">
            <div id="downloadQuit" class="app-list-item">
              <div class="app-list-item-content">
                <span>1、下载离职证明</span>
              </div>
            </div>
            <div id="totalList" class="app-list-item">
              <div class="app-list-item-content">
                <span>2、查询某天在职人数</span>
              </div>
            </div>
            <div id="dashboard" class="app-list-item">
              <div class="app-list-item-content">
                <span>3、人事仪表盘</span>
              </div>
            </div>
          </div>
      `
    });
    // 1、下载离职证明
    $('#downloadQuit').on('click', () => {
      let loadIndex = layer.load(1, {
        shade: [0.1,'#fff'] //0.1透明度的白色背景
      });
      ajax_method('/djorg/getQuitUserList.do', {
        quitStartTime: '',
        quitEndTime: '',
        pageSize: 200,
        page: 1
      }, 'get', function (res) {
        layer.close(loadIndex);
        let quitSelect = '';
        let quitUserList = res.list;
        res.list.map(item => {
          quitSelect += `<tr data-user="${item.userName}"><td><input name="selectUserId" type="checkbox" data-id="${item.id}"></td><td>${item.belongCenter}</td><td>${item.userName}</td><td>${item.quitTime}</td></tr>`;
        });
        layer.open({
          title: '请选择人员（支持多选下载）',
          type: 0,
          area: ['800px', '500px'],
          content: `
          <div>
          <div style="color: #303133;">搜索：<input id="searchCityName" type="text" style="padding: 5px 10px" placeholder="请输入姓名搜索"></div>
          <table class="layui-table">
            <thead>
             <tr>
              <th><input id="selectAll" type="checkbox"></th>
              <th>中心名称</th>
              <th>姓名</th>
              <th>离职时间</th>
             </tr>
            </thead>
            <tbody id="userTable">
              ${quitSelect}
            </tbody>
          </table>
          </div>
          `,
          yes: function(index){
            let arr = [];
            $('input[type=checkbox]').each(function () {
              if ($(this).is(':checked')) {
                let item = quitUserList.find(k => k.id === $(this).attr('data-id'));
                if (item) {
                  arr.push(item);
                }
              }
            });
            let nowDate = dateFormat('YYYY-mm-dd', new Date());
            nowDate = nowDate.split('-');
            arr.forEach((item, index) => {
              (function (item, index) {
                setTimeout(function () {
                  let {userName, position, entryTime, quitTime, sex} = item;
                  entryTime = entryTime.split('-');
                  quitTime = quitTime.split('-');
                  ajax_method('/djorg/getUserPersonInfo.do', {
                    id: item.id
                  }, 'get', function (user) {
                    let {idCard} = user;
                    new DocxGen().loadFromFile(
                      'https://youxiang0411.github.io/test/离职证明.docx',
                      {async: true}
                    ).success(doc => {
                      doc.setTags(
                        {
                          userName: userName || '  ',
                          sex: (sex === '女' ? '女士' : (sex === '男'? '先生' : '')),
                          idCard: idCard || '  ',
                          position: position || '  ',
                          entryTime_1: entryTime[0] || '  ',
                          entryTime_2: entryTime[1] || '  ',
                          entryTime_3: entryTime[2] || '  ',
                          quitTime_1: quitTime[0] || '  ',
                          quitTime_2: quitTime[1] || '  ',
                          quitTime_3: quitTime[2] || '  ',
                          nowDate_1: nowDate[0] || '  ',
                          nowDate_2: nowDate[1] || '  ',
                          nowDate_3: nowDate[2] || '  ',
                        }
                      );
                      doc.applyTags();
                      let result = doc.output({download: false});
                      let elink = document.createElement("a");
                      elink.download = userName + '的离职证明.docx';
                      elink.style.display = "none";
                      elink.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + result;
                      document.body.appendChild(elink);
                      elink.click();
                      document.body.removeChild(elink);
                    });
                  });
                }, index * 2000);
              })(item, index);
            });
            layer.close(index); //如果设定了yes回调，需进行手工关闭
          }
        });

        $('#selectAll').on('click', function () {
          if ($(this).prop('checked')) {
            $('[name=selectUserId]').each(function () {
              $(this).prop('checked',true);
            });
          } else {
            $('[name=selectUserId]').each(function () {
              $(this).prop('checked',false);
            });
          }
        });

        $('#searchCityName').bind('input propertychange', function() {
          var searchCityName = $("#searchCityName").val().trim();
          if (searchCityName == "") {
            $("#userTable tr").show();
          } else {
            $("#userTable tr").each(
              function() {
                var cityName = $(this).attr("data-user");
                if (cityName.indexOf(searchCityName) != -1) {
                  $(this).show();
                } else {
                  $(this).hide();
                }
              });
          }
        });
      });
    });
    // 1、下载离职证明
    $('#downloadQuit1').on('click', () => {
      layer.prompt({
        title: '请输入离职员工的姓名（全名）',
        formType: 3
      }, function (pass, index) {
        layer.close(index);
        pass = pass.trim();// 用户的姓名，一定要全称
        ajax_method('/djorg/getQuitUserList.do', {
          keyword: pass || '',
          quitStartTime: '',
          quitEndTime: '',
          pageSize: 50,
          page: 1
        }, 'get', function (res) {
          let nowDate = dateFormat('YYYY-mm-dd', new Date());
          nowDate = nowDate.split('-');
          if (res.list.length) {
            let {userName, position, entryTime, quitTime, sex} = res.list[0];
            entryTime = entryTime.split('-');
            quitTime = quitTime.split('-');
            ajax_method('/djorg/getUserPersonInfo.do', {
              id: res.list[0].id
            }, 'get', function (user) {
              let {idCard} = user;
              new DocxGen().loadFromFile(
                'https://youxiang0411.github.io/test/离职证明.docx',
                {async: true}
              ).success(doc => {
                doc.setTags(
                  {
                    userName: userName || '  ',
                    sex: (sex === '女' ? '女士' : (sex === '男'? '先生' : '')),
                    idCard: idCard || '  ',
                    position: position || '  ',
                    entryTime_1: entryTime[0] || '  ',
                    entryTime_2: entryTime[1] || '  ',
                    entryTime_3: entryTime[2] || '  ',
                    quitTime_1: quitTime[0] || '  ',
                    quitTime_2: quitTime[1] || '  ',
                    quitTime_3: quitTime[2] || '  ',
                    nowDate_1: nowDate[0] || '  ',
                    nowDate_2: nowDate[1] || '  ',
                    nowDate_3: nowDate[2] || '  ',
                  }
                );
                doc.applyTags();
                let result = doc.output({download: false});
                let link = document.createElement('a');
                link.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + result;
                link.download = userName + '的离职证明.docx';
                link.click();
              });
            });
          } else {
            layer.msg('没有找到不到该用户');
          }
        });
      });
    });
    // 2、统计在职人数
    $('#totalList').on('click', () => {
      layer.prompt({
        title: '请输入入职时间（格式：' + dateFormat('YYYY-mm-dd', new Date()) + '）',
        value: dateFormat('YYYY-mm-dd', new Date()),
        formType: 3
      }, function (pass, index) {
        let regex = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
        if (!regex.test(pass)) {
          layer.msg('时间格式不正确，请重新输入');
          return;
        }
        pass = pass.trim();
        layer.close(index);
        let entryTime = pass + ' 23:59:59';
        ajax_method('/djorg/getUserManage.do', {
          pageSize: 50000,
          page: 1
        }, 'get', function (res) {
          ajax_method('/djorg/getQuitUserList.do', {
            quitStartTime: entryTime.split(' ')[0],
            quitEndTime: dateFormat('YYYY-mm-dd', new Date()),
            pageSize: 50000,
            page: 1
          }, 'get', function (quit) {
            if (!quit) {
              return layer.msg('没有找到数据');
            }
            res.list = res.list.filter(item => !blacklist.includes(item.id)).filter(k => !blackDepart.includes(k.belongCenter));
            quit.list = quit.list.filter(item => !blacklist.includes(item.id)).filter(k => !blackDepart.includes(k.belongCenter));
            var quitArr = [];
            quit.list.map(item => {
              // quitTime
              if (new Date(item.entryTime).getTime() < new Date(entryTime).getTime()) {
                quitArr.push(item)
              }
            });
            var userArr = [];
            res.list.map(item => {
              if (new Date(item.userInductionTime).getTime() < new Date(entryTime).getTime()) {
                userArr.push(item)
              }
            });
            userArr.sort((a, b) => new Date(a.userInductionTime).getTime() - new Date(b.userInductionTime).getTime());
            userArr.map(item => {
              // console.log(`在职——姓名：${item.userName}, 入职时间：${item.userInductionTime}`);
            });
            // console.log('—————————————————————————————————————————————');
            quitArr.sort((a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime());
            quitArr.map(item => {
              // console.log(`离职——姓名：${item.userName}, 入职时间：${item.entryTime}, 离职时间：${item.quitTime}`);
            });
            let tableContent = `
              <div style="padding: 10px 20px;">
                <table class="layui-table">
                  <tbody>
                    <tr>
                      <td>花名册在职人数</td>
                      <td>${userArr.length}人</td>
                    </tr>
                    <tr>
                      <td>已离职人数</td>
                      <td>${quitArr.length}人</td>
                    </tr>
                    <tr>
                      <td>${entryTime.split(' ')[0]}在职人数总计</td>
                      <td>${userArr.length + quitArr.length}人</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `;
            layer.open({
              title: '查询某天在职人数',
              type: 1,
              area: ['400px', '250px'],
              content: tableContent
            });
          });
        });
      });
    });
    // 3、人事仪表盘
    $('#dashboard').on('click', () => {
      let toMonth = dateFormat('YYYY-mm-01 00:00:00', new Date());
      let now = new Date();
      let endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      endMonth = dateFormat('YYYY-mm-' + endMonth +' 23:59:59', new Date());
      let loadIndex = layer.load(1, {
        shade: [0.1,'#fff'] //0.1透明度的白色背景
      });
      ajax_method('/djorg/getUserManage.do', {
        pageSize: 50000,
        page: 1
      }, 'get', function (res) {
        ajax_method('/djorg/getQuitUserList.do', {
          quitStartTime: '',
          quitEndTime: '',
          pageSize: 50000,
          page: 1
        }, 'get', function (quit) {
          res.list = res.list.filter(item => !blacklist.includes(item.id)).filter(k => !blackDepart.includes(k.belongCenter));
          quit.list = quit.list.filter(item => !blacklist.includes(item.id)).filter(k => !blackDepart.includes(k.belongCenter));
          res.list.forEach(item => {
            item.age = getAge(item.userBirthday);
          });
          // 本月离职人数
          layer.close(loadIndex);
          let quitArr = [];
          quit.list.map(item => {
            if (new Date(item.quitTime).getTime() > new Date(toMonth).getTime() && new Date(item.quitTime).getTime() < new Date(endMonth).getTime()) {
              quitArr.push(item)
            }
          });
          // 本月新入职人数
          let userArr = [];
          res.list.map(item => {
            if (new Date(item.userInductionTime).getTime() > new Date(toMonth).getTime() && new Date(item.userInductionTime).getTime() < new Date(endMonth).getTime()) {
              userArr.push(item)
            }
          });
          // 年龄统计
          let userAgeTotal = res.list.sort((a, b) => a.age - b.age).reduce((prev, cur) => {
            if (cur.age <= 20) {
              prev['≤20岁'] ? prev['≤20岁']++: prev['≤20岁'] = 1;
            } else if (cur.age > 20 && cur.age <= 30) {
              prev['20-30岁（含）'] ? prev['20-30岁（含）']++: prev['20-30岁（含）'] = 1;
            } else if (cur.age > 30 && cur.age <= 40) {
              prev['30-40岁（含）'] ? prev['30-40岁（含）']++: prev['30-40岁（含）'] = 1;
            } else if (cur.age > 40 && cur.age <= 50) {
              prev['40-50岁（含）'] ? prev['40-50岁（含）']++: prev['40-50岁（含）'] = 1;
            } else if (cur.age > 50 && cur.age <= 60) {
              prev['50-60岁（含）'] ? prev['50-60岁（含）']++: prev['50-60岁（含）'] = 1;
            } else if (cur.age > 60) {
              prev['＞60岁'] ? prev['＞60岁']++: prev['＞60岁'] = 1;
            }
            return prev;
          }, {});
          let userAgeTemp = Object.keys(userAgeTotal).map(item => ({
            label: item, total: userAgeTotal[item], num: GetPercent(userAgeTotal[item],res.list.length)
          }));
          let userAgeHtml = '';
          userAgeTemp.map(item => {
            userAgeHtml += `
                <tr>
                  <td>${item.label}</td>
                  <td>${item.total}</td>
                  <td>${item.num}</td>
                </tr>
              `;
          });
          // 区域统计
          let userAreaTotal = res.list.reduce((prev, cur) => {
            prev[cur.areaName] ? prev[cur.areaName]++ : prev[cur.areaName] = 1;
            return prev;
          }, {});
          let userAreaTemp = Object.keys(userAreaTotal).map(item => ({
            label: item, total: userAreaTotal[item], num: GetPercent(userAreaTotal[item],res.list.length)
          })).sort((a, b) => b.total - a.total);
          let userAreaHtml = '';
          userAreaTemp.map(item => {
            userAreaHtml += `
                <tr>
                  <td>${item.label}</td>
                  <td>${item.total}</td>
                  <td>${item.num}</td>
                </tr>
              `;
          });
          // 性别统计
          let userSexTotal = res.list.reduce((prev, cur) => {
            prev[cur.userSex] ? prev[cur.userSex]++ : prev[cur.userSex] = 1;
            return prev;
          }, {});
          let userSexTemp = Object.keys(userSexTotal).map(item => ({
            label: item, total: userSexTotal[item], num: GetPercent(userSexTotal[item],res.list.length)
          })).sort((a, b) => b.total - a.total);
          let userSexHtml = '';
          userSexTemp.map(item => {
            userSexHtml += `
                <tr>
                  <td>${item.label}</td>
                  <td>${item.total}</td>
                  <td>${item.num}</td>
                </tr>
              `;
          });
          // 职级统计
          let userJobTotal = res.list.reduce((prev, cur) => {
            prev[cur.userJob] ? prev[cur.userJob]++ : prev[cur.userJob] = 1;
            return prev;
          }, {});
          let userJobTemp = Object.keys(userJobTotal).map(item => ({
            label: item, total: userJobTotal[item], num: GetPercent(userJobTotal[item],res.list.length)
          })).sort((a, b) => b.total - a.total);
          let userJobHtml = '';
          userJobTemp.map(item => {
            userJobHtml += `
                <tr>
                  <td>${item.label}</td>
                  <td>${item.total}</td>
                  <td>${item.num}</td>
                </tr>
              `;
          });
          // 中心统计
          let centerTotal = res.list.reduce((prev, cur) => {
            prev[cur.belongCenter] ? prev[cur.belongCenter]++ : prev[cur.belongCenter] = 1;
            return prev;
          }, {});
          let centerTemp = Object.keys(centerTotal).map(item => ({
            label: item, total: centerTotal[item], num: GetPercent(centerTotal[item],res.list.length)
          })).sort((a, b) => b.total - a.total);
          let centerHtml = '';
          centerTemp.map(item => {
            centerHtml += `
                <tr>
                  <td>${item.label}</td>
                  <td>${item.total}</td>
                  <td>${item.num}</td>
                </tr>
              `;
          });

          let tableContent = `
            <div class="layui-tab layui-tab-brief" style="padding: 0 20px;">
              <ul class="layui-tab-title">
                <li class="layui-this">员工数据</li>
                <li>区域分布</li>
                <li>年龄分布</li>
                <li>性别分布</li>
                <li>职级分布</li>
                <li>中心分布</li>
              </ul>
              <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                  <table class="layui-table">
                    <thead>
                     <tr>
                      <th>在职员工总数</th>
                      <th>本月新入职</th>
                      <th>本月离职</th>
                     </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>${res.list.length}人</td>
                        <td>${userArr.length}人</td>
                        <td>${quitArr.length}人</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="layui-tab-item">
                  <table class="layui-table">
                    <thead>
                     <tr>
                      <th>区域</th>
                      <th>人数/人</th>
                      <th>比例</th>
                     </tr>
                    </thead>
                    <tbody>
                      ${userAreaHtml}
                    </tbody>
                  </table>
                </div>
                <div class="layui-tab-item">
                <table class="layui-table">
                  <thead>
                   <tr>
                    <th>年龄</th>
                    <th>人数/人</th>
                    <th>比例</th>
                   </tr>
                  </thead>
                  <tbody>
                    ${userAgeHtml}
                  </tbody>
                </table>
                </div>
                <div class="layui-tab-item">
                <table class="layui-table">
                  <thead>
                   <tr>
                    <th>性别</th>
                    <th>人数/人</th>
                    <th>比例</th>
                   </tr>
                  </thead>
                  <tbody>
                    ${userSexHtml}
                  </tbody>
                </table>
                </div>
                <div class="layui-tab-item">
                <table class="layui-table">
                  <thead>
                   <tr>
                    <th>职级名称</th>
                    <th>人数/人</th>
                    <th>比例</th>
                   </tr>
                  </thead>
                  <tbody>
                    ${userJobHtml}
                  </tbody>
                </table>
                </div>
                <div class="layui-tab-item">
                <table class="layui-table">
                  <thead>
                   <tr>
                    <th>中心名称</th>
                    <th>人数/人</th>
                    <th>比例</th>
                   </tr>
                  </thead>
                  <tbody>
                    ${centerHtml}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          `;
          layer.open({
            title: '人事仪表盘',
            type: 1,
            area: ['800px', '500px'],
            content: tableContent
          });
        });
      });
    });
  });
});
