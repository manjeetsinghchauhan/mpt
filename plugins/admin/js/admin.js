app.factory('Validation',
    function () {

	var valid={};
	
        valid.validationCheck = function (name,data){
						if(name==="salesTargets"){
							return salesTargetsCheck(data);
						}
						if(name==="attribute"){
							return attributeCheck(data);
						}
						if(name==="creatives"){
							return creativeCheck(data);
						}
						if(name==="products"){
							return productCheck(data);
						}
					}
	
	function salesTargetsCheck (data){
		if((data.name=="" || data.name==undefined)){
			var result = {};
			result.value = true;
			result.error = "Required fields are missing";
			return result; 
		}else if(isAlphaNumeric(data.name)==undefined||isAlphaNumeric(data.name)==""){
			var result={};
			result.value = true;
			result.error = "Name field should be alphanumeric";
			return result;
		}
		else{
			var result = {};
			result.value = false;
			result.error = "";
			return result;
		}
	};
	
	function attributeCheck (data){
		if((data.name=="" ||data.name == undefined)||(data.type =="" ||data.type == undefined)||(data.value == "" ||data.value == undefined)){
			var result = {};
			result.value = true;
			result.error = "Required fields are missing";
			return result;
		}else if(isAlphaNumeric(data.name)==undefined||isAlphaNumeric(data.name)==""){
			var result={};
			result.value = true;
			result.error = "Name field should be alphanumeric";
			return result;
		} 
		else{
			var result = {};
			result.value = false;
			result.error = "";
			return result;
		}
	};
	
	function creativeCheck (data){
		if((data.name == "" ||data.name == undefined)||(data.type == "" || data.type == undefined)||(data.height1 == "" || data.height1 == undefined)||(data.width1 == "" || data.width1 == undefined)){
			var result = {};
			result.value = true;
			result.error = "Required fields are missing";
			return result; 
		}else if(isAlphaNumeric(data.name)==undefined||isAlphaNumeric(data.name)==""){
			var result={};
			result.value = true;
			result.error = "Name field should be alphanumeric";
			return result;
		}
		else if(data.height1 <= 0 || data.width1 <= 0 || data.height2 < 0 || data.width2 < 0){
			var result = {};
			result.value = true;
			result.error = "Please enter values greater than zero(0)";
			return result;
		}
		else if(isNaN(data.height1) || isNaN(data.width1) || ((data.height2 != "" && data.height2 !=undefined) && isNaN(data.height2)) || (data.width2 != "" && data.width2 !=undefined) && isNaN(data.width2)){
			var result = {};
			result.value = true;
			result.error = "Please enter valid numbers";
			return result;
		}
		else if(!isInteger(parseInt(data.height1)) || !isInteger(parseInt(data.width1)) || ((data.width2 != "" && data.width2 !=undefined) &&  !isInteger(parseInt(data.width2))) || ( (data.height2 != "" && data.height2 !=undefined) &&  !isInteger(parseInt(data.height2)))){
			var result = {};
			result.value = true;
			result.error = "Decimal value is not allowed";
			return result;
		}
		else { 
			var result = {};
			result.value = false;
			result.error = "";
			return result;
		}
	};
	
	function productCheck (data){
		if((data.name=="" || data.name==undefined) || (data.basePrice=="" || data.basePrice==undefined) || (data.type=="" || data.type==undefined) || (data.classs=="" || data.classs==undefined)){
			var result = {};
			result.value = true;
			result.error = "Required fields are missing";
			return result;
		}
		else if(data.basePrice <= 0){
			var result = {};
			result.value = true;
			result.error = "Please enter values greater than zero(0)";
			return result;
		}
		else if(data.salesTargetList == undefined || data.salesTargetList.length == 0){
			var result = {};
			result.value = true;
			result.error = "Please select segments";
			return result;
		}
		else if(isNaN(data.basePrice)){
			var result = {};
			result.value = true;
			result.error = "Please enter valid numbers";
			return result;
		}else if(isAlphaNumeric(data.name)==undefined||isAlphaNumeric(data.name)==""){
			var result={};
			result.value = true;
			result.error = "Name field should be alphanumeric";
			return result;
		}else{
			var result = {};
			result.value = false;
			result.error = "";
			return result;
		}
	};
	
	
	function isAlphaNumeric(name){
		var regExp = /^[A-Za-z0-9$_£ ₹-]+$/;
		return (name.match(regExp));
	};
	
	 function isInteger (x) {
	        return Math.round(x) === x;
	 };
	
	return valid;
	
	
});
