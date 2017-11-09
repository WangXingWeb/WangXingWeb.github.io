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
    }
}

