/*
* author:wangxing
* date:2017/11/08
* */
var mainBmob={
    init:function(){
        Bmob.initialize("47793ef8c6c5506ff8f2940fbbb68342", "0125a0a418ad7f4aa9c49f13ed12c78d");
    },
    addData:function(option,objName){
        var Obj = Bmob.Object.extend(objName);
        var obj = new Obj();
        for(var key in option){
            obj.set(key,option[key]);
        }
        function saveData(resolve, reject) {
            obj.save(null, {
                success: function (object) {
                    resolve({
                        status:true,
                        objectId:object.id
                    });
                },
                error: function (model, error) {
                    resolve({
                        status:false,
                        objError:error
                    });
                }
            });
        }
        var promise = new Promise(saveData);
        return promise;
    },
    createQuery:function(objName){
        var Query = Bmob.Object.extend(objName);
        var objQuery = new Bmob.Query(Query);
        return objQuery;
    },
    delData:function (objName,id) {
        var query=this.createQuery(objName);
        function destroryData(resolve, reject){
            query.get(id, {
                success: function(object) {
                    // The object was retrieved successfully.
                    object.destroy({
                        success: function(deleteObject) {
                            resolve(1);
                        },
                        error: function(GameScoretest, error) {
                            resolve(2);
                        }
                    });
                },
                error: function(object, error) {
                    resolve(3);
                }
            });
        }
        var promise = new Promise(destroryData);
        return promise;
    },
    changeData:function(option,objName,id){
        var query=this.createQuery(objName);
        function change(resolve, reject){
            query.get(id, {
                success: function(object) {
                    for(var key in option){
                        object.set(key,option[key]);
                    }
                    object.save(null, {
                        success: function(objectUpdate) {
                            resolve(1);
                            //alert("create object success, object score:"+objectUpdate.get("score"));
                        },
                        error: function(model, error) {
                            resolve(2);
                            //alert("create object fail");
                        }
                    });
                },
                error: function(object, error) {
                    resolve(3);
                    //alert("query object fail");
                }
            });
        }
    },
    loadImage:function(fileName,file){
        var bytes = "Hello, World!";
        var file = new Bmob.File("hello.txt", bytes);
        file.save().then(function(obj) {
            //alert(obj.url());
        }, function(error) {
            // the save failed.
        });
    }
}

