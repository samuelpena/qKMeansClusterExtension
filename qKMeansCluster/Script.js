//Define Global Variables
var submitPress = 0;
var Extension_path = Qva.Remote + "?public=only&name=Extensions/qKMeansCluster/";

function qKMeansCluster_Init() {
	Qv.AddExtension("qKMeansCluster",
		function() {

			var _this = this;
            if (!_this.ExtensionLoaded) {
                this.ExtensionLoaded = true;
            }
            else {
                //alert('Extension loaded for ' + _this.Layout.ObjectId);
            }
			//-------------------------
			// Load External files
			//-------------------------
			// Add CSS
			//-------------------------
			Qva.LoadCSS(Extension_path + "css/style.css");	
			//-------------------------
			// Add javascript libraries
			//-------------------------
			Qva.LoadScript(Extension_path + "js/opencpu.js", function() {
                Qva.LoadScript(Extension_path + "js/json2.js", function(){
                    Qva.LoadScript(Extension_path + "js/jquery.js", function(){
                        Qva.LoadScript(Extension_path + "js/json-to-table.js", function(){
                            Qva.LoadScript(Extension_path + "js/jquery.dynatable.js", function(){
                                Qva.LoadScript(Extension_path + "js/underscore-min.js", function(){
                                });
                            });
                        });
                    });
                });
            });  
            
            setProps();
			$(_this.Element).empty();

			initLoadingPane();
            showLoadingPanel();
            initGrid();
            initFooter();
            //Need an if condition here to see if we should load data or submitted data)
            loadData();

            // ------------------------------------------------------
            // Set Properties
            // ------------------------------------------------------
            function setProps() {
                // Retrieve Props
                _this.WebserviceUrl = _this.Layout.Text0.text;
                _this.Cluster_Parameter = _this.Layout.Text1.text;
                _this.dimLabel = new Array(); //is this the right place to put it?
            }

            // ------------------------------------------------------------------
            // Html structure
            // ------------------------------------------------------------------
            function initGrid() {

                var tableDiv = document.createElement("div");
                // see http://stackoverflow.com/questions/139000/div-with-overflowauto-and-a-100-wide-table-problem
                // for browsers < IE7
                tableDiv.style.overflow = "auto";
                tableDiv.style.height = _this.GetHeight() - 35 + "px";
                tableDiv.className = "divTable";

                var myTable = document.createElement("div");
                myTable.className = "tblDataSelection";
                myTable.id = "tblDataSelection_" + safeId(_this.Layout.ObjectId);

                tableDiv.appendChild(myTable);
                _this.Element.appendChild(tableDiv);
            }

            function initFooter() {
                var divStatusBar = document.createElement("div");
                divStatusBar.className = "statusBar";
                divStatusBar.id = "statusBar_" + safeId(_this.Layout.ObjectId); 

                // Statusbar-Content
                var divStatusContent = document.createElement("div");
                divStatusContent.className = "statusContent";
                divStatusContent.id = "statusContent_" + safeId(_this.Layout.ObjectId);
                divStatusBar.appendChild(divStatusContent);

                // Submit-Button
                var divSubmit = document.createElement("div"); 
                divSubmit.className = "divSubmit";
                var submitButton = document.createElement("input");
                submitButton.type = "button";
                submitButton.value = "Submit";
                if (!submitButton.addEventListener) {
                    //for IE8
                    submitButton.attachEvent("onclick", submitButton_Click);
                } else {
                    submitButton.addEventListener("click", submitButton_Click, false);
                }               
                divSubmit.appendChild(submitButton); 
                divStatusBar.appendChild(divSubmit);

                _this.Element.appendChild(divStatusBar);
            }

            // ------------------------------------------------------------------
            // Status Bar
            // ------------------------------------------------------------------

            function hideStatusBar() {
                $('#statusBar_' + safeId(_this.Layout.ObjectId)).hide();
            }
            function showStatusBar() {
                $('#statusBar_' + safeId(_this.Layout.ObjectId)).show();
            }

            function addStatusMsg(msg) {
                document.getElementById("statusContent_" + safeId(_this.Layout.ObjectId)).innerHTML = msg;
                showStatusBar();
            }

			// ------------------------------------------------------------------
            // Loading Panel
            // ------------------------------------------------------------------
			 function showLoadingPanel() {
                $("#loadingPanel_" + GetSafeId()).show();
            }

            function hideLoadingPanel() {
                $("#loadingPanel_" + GetSafeId()).hide();
            }

            function initLoadingPane() {

                var divLoader = document.createElement("div");
                divLoader.className = "divLoading";
                divLoader.id = "loadingPanel_" + GetSafeId();
				
                var imageUrl = GetImage("qKMeansCluster", "loading.gif");
				var loadingMsg = document.createElement("div");
                loadingMsg.style.width = GetTableWidth();

                loadingMsg.style.textAlign = "center";
				
                var loadingInnerMsg = document.createElement("div");
                loadingInnerMsg.id = "loadingInnerMsg_" + GetSafeId();
                loadingInnerMsg.className = "loadingInnerMsg";

                var loadingImg = document.createElement("img");
                loadingImg.src = imageUrl;
                loadingImg.className = "loadingImg";
                loadingImg.style.paddingTop = (_this.GetHeight() / 2) - 40 + "px";

                loadingMsg.appendChild(loadingImg);
                loadingMsg.appendChild(loadingInnerMsg);
                divLoader.appendChild(loadingMsg);

                _this.Element.appendChild(divLoader);

            }

            // ------------------------------------------------------------------
            // Data related
            // ------------------------------------------------------------------
            function loadData() {
                hideLoadingPanel();
                var data = JsonTable(GetData());
                var jsonHtmlTable = ConvertJsonToTable(data.value, 'tblData_' + safeId(_this.Layout.ObjectId), 'dynatable-tblData', 'Download');

                $("#tblDataSelection_" + safeId(_this.Layout.ObjectId)).append(jsonHtmlTable);
                $('#tblData_' + safeId(_this.Layout.ObjectId)).dynatable({
                    table: {
                        defaultColumnIdStyle: 'myNewStyle'
                    },
                    features: {
                        paginate: false,
                        recordCount: false,
                        search: false,
                        perPageSelect: false
                    }
                });
            }            

			// ------------------------------------------------------------------
            // Internal Methods
            // ------------------------------------------------------------------
            function GetTableHeight() {
                return _this.GetHeight() - 35 + "px";
            }

            function GetTableWidth() {
                return _this.GetWidth() + "px";
            }

            function safeId(str) {
                return str.replace("\\", "_");
            }

            function GetSafeId() {
                return safeId(_this.Layout.ObjectId);
            }

            function GetImage(ext, filename) {
            	return Qva.Remote+(Qva.Remote.indexOf("?")>=0?"&":"?")+"public=only"+"&name=Extensions/"+ext+"/img/"+filename;
            }

            function SetDimensionLabel(elementLabel) {
                //BUG: Pushing out the same element twice [x, y, x, y]
                _this.dimLabel.push(elementLabel);
            }

            function GetDimensionLabel() {
                //BUG: Element is repeated twice therefore will slice it in half
                //var halfArray = _this.dimLabel.length/2;
                //var arrayTemp = _this.dimLabel.splice(halfArray,halfArray);
                //console.log(_this.dimLabel.splice(halfArray,halfArray));
                return _this.dimLabel;
            }

            function GetData(){
                if (!Qva.Public.Wrapper.prototype.getData) {
                        var data = {},
                        header = _this.Data.HeaderRows[0],
                        i = 0;
                        data.Rows = _this.Data.Rows;
                        data.Column = Object.keys(data.Rows[0]).map(function(c) {
                            return data.Rows.map(function(r) {
                                return r[c];
                            });
                        });
                        data.Column.forEach(function(element, index) {
                            element.type = element[0].color === undefined ? "expression" : "dimension";
                            element.label = header[index].text;
                            if(element.type == "dimension") {SetDimensionLabel(element.label)};
                        });
                        return data;
                }    
            }
            
            function JsonTable(data) {
                var jsonData = new Object();
                var arrayData = new Array();
                var arrayType = new Array();
                jsonData={data:{},type:{}};
                    for(var rowIx = 0; rowIx < data.Rows.length; rowIx++) {
                        for(var colIx = 0; colIx < data.Column.length; colIx++) {
                            jsonData.data[data.Column[colIx].label] = data.Rows[rowIx][colIx].text;
                            if(rowIx == data.Rows.length-1 )
                            {
                                jsonData.type[data.Column[colIx].label] = data.Column[colIx].type;
                            }
                        }
                        //http://stackoverflow.com/questions/25025629/values-messed-up-when-pushing-multi-level-object-literal-to-array
                        arrayData.push($.extend(true, {}, jsonData.data));
                        if(rowIx == data.Rows.length-1 )
                        {
                            arrayType.push($.extend(true, {}, jsonData.type));
                        }
                    }
                var item = {
                            "value":arrayData,
                            "type": arrayType 
                        }
                //returns JSON object with 2 items
                //value: contains all the data by rows
                //type: contains if the column is a dimension or expression
                return item;
            }

            function ConvertJson(data) {
                var jsonData  = new Object();
                jsonData={data:{},type:{}, cluster:{}};
                var arrayTemp = new Array();
                    for(var colIx = 0; colIx < data.Column.length; colIx++) {
                        for(var rowIx = 0; rowIx < data.Rows.length; rowIx++) {
                            arrayTemp[rowIx] = data.Column[colIx][rowIx].text;
                        }
                        jsonData.data[data.Column[colIx].label] = arrayTemp.slice();
                        jsonData.type[data.Column[colIx].label] = data.Column[colIx].type;
                        //http://stackoverflow.com/questions/25025629/values-messed-up-when-pushing-multi-level-object-literal-to-array
                    }
                    jsonData.cluster['group'] = _this.Cluster_Parameter;
                //returns JSON object with 3 items
                //value: contains all the data by rows
                //type: contains if the column is a dimension or expression
                return jsonData;
            }

            // ------------------------------------------------------------------
            // Events ...
            // ------------------------------------------------------------------

            function submitButton_Click() {
                $("#tblDataSelection_" + GetSafeId()).hide();
                showLoadingPanel();
                var jsonDataR = ConvertJson(GetData());

                //set CORS to call "stocks" package on public server
                ocpu.seturl(_this.WebserviceUrl);
                
                //some example data kmean
                //to run with different data, edit and press Run at the top of the page
                 var req = ocpu.rpc("kmean",{
                        Data : jsonDataR
                    }, function(output){
                                               
                        //-------------------------------------------------------
                        //TODO: I need to move this outside of the submit button eventually
                        var jsonHtmlTable = ConvertJsonToTable(output, 'tblClusterData_' + safeId(_this.Layout.ObjectId), 'dynatable-tblData', 'Download');
                        //Empty thye tag to set room for the new object
                        $("#tblDataSelection_" + GetSafeId()).empty();
                        // Create the new straight table
                        $("#tblDataSelection_" + safeId(_this.Layout.ObjectId)).append(jsonHtmlTable);
                        $('#tblData_' + safeId(_this.Layout.ObjectId)).dynatable({
                            table: {
                                defaultColumnIdStyle: 'myNewStyle'
                            },
                            features: {
                                paginate: false,
                                recordCount: false,
                                search: false,
                                perPageSelect: false
                            }
                        });

                        hideLoadingPanel();

                        $("#tblDataSelection_" + GetSafeId()).show();
                        //-------------------------------------------------------

                    }); 
                    //optional
                    req.fail(function(){
                        alert("R returned an error: " + req.responseText); 
                    });
            }
		}
	)
}



//Runs Cluster Analysis Init()
qKMeansCluster_Init();