//获取时间戳与时间字符串
function getDate() {
	var time = new Date();
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	var day = time.getDate();

	return {
		ms: +time,
		date: year + '-' + fixTwo(month) + '-' + fixTwo(day)
	};
}

//将100以下数字转化为两位字符串
function fixTwo(n) {
	return n < 10 ? '0' + n : '' + n;
}

//从数组中删除某元素
function removeFromArr(arr,ele) {
	var index;

	for (var i=0;i<arr.length;i++) {
		if (arr[i] == ele) {
			index = i;
			break;
		}
	}

	arr.splice(index,1);
	return arr;
}

//浅克隆obj
function clone(obj) {
	var newObj = {};

	for (var i in obj) {
		newObj[i] = obj[i];
	}

	return newObj;
}

//从objArr中去除与referArr相同的元素
function removeSameEles(objArr,referArr) {
	var idx;

	for (var i=0;i<referArr.length;i++) {
		idx = objArr.indexOf(referArr[i]);
		if (idx != -1) {
			objArr.splice(idx,1);
		}
	}

	return objArr;
}

