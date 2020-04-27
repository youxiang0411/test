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
dynamicLoading.js('https://www.layuicdn.com/layui/layui.js', () => {
  layui.use(['jquery', 'layer', 'table'], () => {
    let $ = layui.jquery, layer = layui.layer, table = layui.table;
    layer.open({
      title: '功能列表',
      type: 1,
      area: ['500px', '300px'],
      content:
        `
       <div style="padding: 20px;">
         <button id="downloadQuit" type="button" class="layui-btn layui-btn-primary">1、下载离职证明</button>
         <button id="totalList" type="button" class="layui-btn layui-btn-primary">2、查询某天在职人数</button>
         <button id="dashboard" type="button" class="layui-btn layui-btn-primary">3、人事仪表盘</button>
       </div>
      `
    });
    // 1、下载离职证明
    $('#downloadQuit').on('click', () => {
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
          if (res.list.length) {
            let {userName, position, entryTime, quitTime} = res.list[0];
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
                    idCard: idCard || '  ',
                    position: position || '  ',
                    entryTime_1: entryTime[0] || '  ',
                    entryTime_2: entryTime[1] || '  ',
                    entryTime_3: entryTime[2] || '  ',
                    quitTime_1: quitTime[0] || '  ',
                    quitTime_2: quitTime[1] || '  ',
                    quitTime_3: quitTime[2] || '  ',
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
            quitEndTime: entryTime.split(' ')[0],
            pageSize: 50000,
            page: 1
          }, 'get', function (quit) {
            if (!quit) {
              return layer.msg('没有找到数据');
            }
            var quitArr = [];
            quit.list.map(item => {
              if (new Date(item.quitTime).getTime() < new Date(entryTime).getTime()) {
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
            // console.log('—————————————————————————————————————————————');
            // console.log(`总在职人数：${userArr.length}人，当天离职人数：${quitArr.length}人`);
            // console.log(`总计：${userArr.length + quitArr.length}人`);

            let areaNameTotal = userArr.reduce((prev, cur) => {
              prev[cur.areaName] ? prev[cur.areaName]++ : prev[cur.areaName] = 1;
              return prev;
            }, {});
            let areaTemp = Object.keys(areaNameTotal).map(item => ({label: item, total: areaNameTotal[item]})).sort((a, b) => b.total - a.total);
            let areaHtml = '';
            areaTemp.map(item => {
              areaHtml += `
                <tr>
                  <td>${item.label}</td>
                  <td>${item.total}人</td>
                </tr>
              `;
            });

            let departTotal = [...userArr, ...quitArr].reduce((prev, cur) => {
              prev[cur.belongCenter] ? prev[cur.belongCenter]++ : prev[cur.belongCenter] = 1;
              return prev;
            }, {});
            let temp = Object.keys(departTotal).map(item => ({label: item, total: departTotal[item]})).sort((a, b) => b.total - a.total);
            let vhtml = '';
            temp.map(item => {
              vhtml += `
                <tr>
                  <td>${item.label}</td>
                  <td>${item.total}人</td>
                </tr>
              `;
            });

            let tableContent = `
              <div style="padding: 20px;">
                <table class="layui-table">
                   <colgroup>
                    <col width="150">
                    <col>
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>总在职人数</td>
                      <td>${userArr.length}人</td>
                    </tr>
                    <tr>
                      <td>当天离职人数</td>
                      <td>${quitArr.length}人</td>
                    </tr>
                    <tr>
                      <td>总计</td>
                      <td>${userArr.length + quitArr.length}人</td>
                    </tr>
                    <tr>
                      <td>男员工人数</td>
                      <td>${userArr.filter(item => item.userSex === '男').length + quitArr.filter(item => item.sex === '男').length}人</td>
                    </tr>
                    <tr>
                      <td>女员工人数</td>
                      <td>${userArr.filter(item => item.userSex === '女').length + quitArr.filter(item => item.sex === '女').length}人</td>
                    </tr>
                    <tr>
                      <td>保密人数</td>
                      <td>${userArr.filter(item => item.userSex === '保密').length + quitArr.filter(item => item.sex === '保密').length}人</td>
                    </tr>
                    ${areaHtml}
                    <tr>
                      <td>区域总计</td>
                      <td>${areaTemp.reduce((prev, cur) => prev + cur.total, 0)}人</td>
                    </tr>
                    ${vhtml}
                    <tr>
                      <td>部门总计</td>
                      <td>${temp.reduce((prev, cur) => prev + cur.total, 0)}人</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `;
            layer.open({
              title: '统计人数',
              type: 1,
              area: ['500px', '500px'],
              content: tableContent
            });
          });
        });
      });
    });
    // 3、人事仪表盘
    $('#dashboard').on('click', () => {
      let toMonth = dateFormat('yyyy-mm-01 00:00:00', new Date());
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
          // 本月离职人数
          let quitArr = [];
          quit.list.map(item => {
            if (new Date(item.quitTime).getTime() > new Date(toMonth).getTime()) {
              quitArr.push(item)
            }
          });
          // 本月新入职人数
          let userArr = [];
          res.list.map(item => {
            if (new Date(item.userInductionTime).getTime() > new Date(toMonth).getTime()) {
              userArr.push(item)
            }
          });
          // 区域统计
          let userAreaTotal = res.list.reduce((prev, cur) => {
            prev[cur.areaName] ? prev[cur.areaName]++ : prev[cur.areaName] = 1;
            return prev;
          }, {});
          let userAreaTemp = Object.keys(userAreaTotal).map(item => ({
            label: item, total: userAreaTotal[item], num: parseInt((userAreaTotal[item]/ res.list) * 100)
          })).sort((a, b) => b.total - a.total);
          let userAreaHtml = '';
          userAreaTemp.map(item => {
            userAreaHtml += `
                <tr>
                  <td>${item.label}</td>
                  <td>${item.total}人</td>
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
            label: item, total: userSexTotal[item], num: parseInt((userSexTotal[item]/ res.list) * 100)
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
            label: item, total: userJobTotal[item], num: parseInt((userJobTotal[item]/ res.list) * 100)
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
            label: item, total: centerTotal[item], num: parseInt((centerTotal[item]/ res.list) * 100)
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
              <div style="padding: 20px;">
                <table class="layui-table">
                   <thead>
                   <tr>
                    <th>在职员工人数</th>
                    <th>本月新入职</th>
                    <th>本月离职</th>
                   </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${res.list}人</td>
                      <td>${userArr.list}人</td>
                      <td>${quitArr.list}人</td>
                    </tr>
                  </tbody>
                </table>
                <div>区域分布</div>
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
                <div>性别分布</div>
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
                <div>职级分布</div>
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
                <div>中心分布</div>
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
            `;
          layer.open({
            title: '人事仪表盘',
            type: 1,
            area: ['800px', '800px'],
            content: tableContent
          });
        });
      });
    });
  });
});
