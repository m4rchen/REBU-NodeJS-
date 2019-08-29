function func(callback) {
    callback("Callback!!");
}

func((param) => {
    console.log(param);
});