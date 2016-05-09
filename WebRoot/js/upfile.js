function UploadFile(id, file){
                this.id = id;
                this.file = file;
                this.state = 0;
            }
            
            var html = '<div class="pborder"><div class="drawpro">' +
            '<span class="pspan">0%</span></div></div><span name="path"></span><img src="css/del.png" style="float:right" width="20" height="20" name="del" onclick=abortUpload(this)>';
            
            var targetDIV_id = "target";
            var httpXML = null;
            var httpProgress = null;
            var filelist = new Array();
            var uplist = new Array();
            var f_input;
            var flag = true;
            var url = "Upload";
            var gurl = "getProgress";
            var cancelFlag=0;
            var timer, waittimer;
            var nowID = 0;
            var ID = 0;
           
            window.onload=function init(){
                f_input = document.getElementById("file");
                
            }
            
            function addOne(){
                f_input.value = null;
                f_input.click();
                //f_input.onchange = addfile;
                
            }
            
            function addfile(evt){
                var f = f_input.files[0];
                
                if (f != undefined) {
                    var uf = new UploadFile(ID, f);
                    uplist.push(uf);                  
                    var div = document.createElement("DIV");                    
                    div.setAttribute("id", "pro" + (ID));
                    div.setAttribute("class","pro");
                    ID++;
                    div.innerHTML = html;
                    var targetDiv = document.getElementById(targetDIV_id);
                    targetDiv.appendChild(div);
                    targetDiv.getElementsByTagName("SPAN")[1].innerHTML="文件名:"+f.name;
                    waittimer = setInterval("upload()", 1000);
                    
                    
                }
            }
            
            function upload(){
    
                if (flag == true) {

                    if (uplist.length > 0) {
                    
                        var uf;
                        for (var i = 0; i < uplist.length; i++) {
                            if (uplist[i].state == 0) {
                                uf = uplist[i];
                                uplist[i].state = 1;
                                break;
                            }
                        }

                        if (uf != undefined & uf != null) {
                            flag = false;
                            if (window.XMLHttpRequest) {
                                httpUP = new XMLHttpRequest();
                            }
                            else 
                                if (window.ActiveXObject) {
                                    httpUP = new ActiveXObject("Microsoft.XMLHTTP");
                                }
                            var formData = new FormData();
                            formData.append("file", uf.file);
                            httpUP.open("POST", url, true);
                            httpUP.send(formData);
                            nowID = uf.id;
                            
                            timer = setInterval("getP()", 50);
                            
                        }
                    }
                }
            }
            
            function getP(){
                if (window.XMLHttpRequest) {
                    httpProgress = new XMLHttpRequest();
                }
                else 
                    if (window.ActiveXObject) {
                        httpProgress = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                httpProgress.onreadystatechange = onProgress;
                
                httpProgress.open("post", gurl, true);
                
                httpProgress.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                httpProgress.send("&timeStamp=" + (new Date()).getTime());
            }
            
            function onProgress(){
                if (httpProgress.readyState == 4 && httpProgress.status == 200) {
                    result = httpProgress.responseText;
                    var result = result.replace(/(^\s*)|(\s*$)/g, "");
                    var res = result.split(",");
                    var now = parseInt(res[0]);
                    var all = parseInt(res[1]);
                    var err = res[2];
                    var state = res[3];
                    var path = res[4];
                    var per = (now / all * 100).toFixed(2);
                    var prodiv = document.getElementById("pro" + nowID);
                    
                    
                    if (err != "" & err.length > 0 & err != null) {
                        window.clearInterval(timer); 
                        if(cancelFlag==1){
    						err="上传终止";
    						cancelFlag=0;
    					}
                        prodiv.getElementsByTagName("DIV")[0].style.display = "none";
                        prodiv.getElementsByTagName("IMG")[0].style.display = "none";
                        prodiv.getElementsByTagName("SPAN")[1].innerHTML = err;
                        httpUP.abort();
                        document.title = "文件上传";
                        flag = true;
                        uplist[nowID].state = 3;
                        return;
                    }
                    if (state == "OK") {
                        prodiv.getElementsByTagName("DIV")[0].style.display = "none";
                        prodiv.getElementsByTagName("IMG")[0].style.display = "none";
                        //prodiv.getElementsByTagName("SPAN")[1].innerHTML = path;
                        var tmpf=uplist[nowID].file;
                        var size=formatFileSize(tmpf.size);
                        prodiv.getElementsByTagName("SPAN")[1].innerHTML = "文件名:"+tmpf.name+" ---- 文件大小:"+size;
                        window.clearInterval(timer);
                        filelist.push(path);
                        alert("上传成功！" + path);
                        flag = true;
                        document.title = "文件上传";
                        uplist[nowID].state = 2;
                        return;
                    }
                    prodiv.getElementsByTagName("DIV")[1].style.width = per * 5 + "px";
                    prodiv.getElementsByTagName("SPAN")[0].innerHTML = per + "%";
                    document.title = per + "%";
                    
                }
                
            }
            
            
            
            function abortUpload(obj){
                var idStr = obj.parentNode.id;
                var id = idStr.slice(3);
                if (id == nowID) {
                    httpUP.abort();
                    flag = true;
                    cancelFlag=1;
                    alert("上传中止");
                }
                else {
                    uplist[id].state = 3;
                    document.getElementById(idStr).remove();
                }
                
            }
            function formatFileSize(bytes) {
                if (typeof bytes !== 'number') {
                    return '';
                }

                if (bytes >= 1000000000) {
                    return (bytes / 1000000000).toFixed(2) + ' GB';
                }

                if (bytes >= 1000000) {
                    return (bytes / 1000000).toFixed(2) + ' MB';
                }

                return (bytes / 1000).toFixed(2) + ' KB';
            }