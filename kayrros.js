window.myApp = (function(){

    function getValueFromInput(id) {
        return document.getElementById(id).value;
    }

    function addAssetToList(asset) {
        var assets = window.localStorage.getItem("AssetsDB");
        assets = JSON.parse(assets) || [];
        assets.push(asset);
        window.localStorage.setItem("AssetsDB", JSON.stringify(assets));
    }

    function getAssetsList(label) {
        var assets = window.localStorage.getItem("AssetsDB");
        assets = JSON.parse(assets) || [];
        if(typeof label !== 'string') {
            return assets;
        }
        return assets.filter(function (asset) {
            return asset.label.includes(label.trim());
        });
    }

    function hideElement(id) {
        document.getElementById(id).style.display = "none";
    }

    function showElement(id) {
        document.getElementById(id).style.display = "block";
    }

    return {
        addAsset: function () {
            var commaSeparatedLabels = getValueFromInput("label");
            var labels = typeof commaSeparatedLabels === "string" ? commaSeparatedLabels.split(",") : [];
            var asset = {
                name: getValueFromInput("name"),
                category: getValueFromInput("category"),
                area: getValueFromInput("area"),
                income: getValueFromInput("income"),
                label: labels.map(function (val) {
                    return val.trim();
                })
            }
            addAssetToList(asset);
        },
        show: function (num) {
            hideElement('list-view');
            document.getElementById("list-body").innerHTML = '';
            hideElement('asset-list');
            hideElement('queries');
            hideElement('add-asset');

            if(num == 1) {
                showElement('add-asset');
            } else if(num == 2) {
                showElement('asset-list');
            } else if(num == 3) {
                showElement('queries');
            }
        },
        showList: function () {
            var tag = getValueFromInput("label-view");
            var assetList = getAssetsList(tag);
            var rows = "";
            for(var i = 0; i < assetList.length; i++) {
                var assetItem = assetList[i];
                rows += `<tr><td>${assetItem.name}</td><td>${assetItem.category}</td><td>${assetItem.area}</td><td>${assetItem.income}</td><td>${assetItem.label.join(", ")}</td></tr>`
            }
            document.getElementById("list-body").innerHTML = rows;
            showElement("list-view");
        },
        getResult: function () {
            var outputType = getValueFromInput("output-type");
            console.log(outputType);
            var category = getValueFromInput("q-category") || "";
            var labelQuery = getValueFromInput("q-labels");
            var labels = labelQuery ? labelQuery.split(",") : [];
            var op = getValueFromInput("q-op");
            var assets = getAssetsList();

            var filterMethod = null;
            if(op === 'and') {
                filterMethod = function (asset) {
                    var booleanFlag = labels.length === 0 ? true : asset.label.includes(labels[0]);
                    for(var i = 1; i < labels.length; i++) {
                        booleanFlag = booleanFlag && asset.label.includes(labels[i]);
                    }
                    return (asset.category.toUpperCase() === category.toUpperCase() && booleanFlag);
                }
            } else if(op === 'or') {
                filterMethod = function (asset) {
                    var booleanFlag = labels.length === 0 ? true : asset.label.includes(labels[0]);
                    for(var i = 1; i < labels.length; i++) {
                        booleanFlag = booleanFlag || asset.label.includes(labels[i]);
                    }
                    return (asset.category.toUpperCase() === category.toUpperCase() && booleanFlag);
                }
            }
            var resultedAssets = assets.filter(filterMethod);
            var sum = 0;
            for(var i = 0; i < resultedAssets.length; i++) {
                sum += resultedAssets[i][outputType];
            }
            document.getElementById('q-output').innerText = sum;
        }

    }
})();