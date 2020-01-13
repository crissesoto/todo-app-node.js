    // get the current day

	// export the function
    module.exports = getDay;
    
    function getDay (){

	const options = {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	};
	const date = new Date();
    const today = date.toLocaleDateString('en-GB', options);
    
    return  today;

}