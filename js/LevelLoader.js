function loadLevel(){
	var filePath = '../Levels/SR001.txt'
	var request = new XMLHttpRequest();
	request.open('GET' , filePath , false);
	request.onreadystatechange = function (){
		if(request.readyState === 4){
			if(request.status === 200 || request.status == 0){
				var allText = request.responseText;
				alert(allText);
			}
		}
    }
	request.send(null);
	var fileArray = allText.split('\n')
	alert(fileArray[1]);
}

function loadExternalLevel(){
/*
		  function handleFileSelect(evt) {
			var files = evt.target.files; // FileList object

			// files is a FileList of File objects. List some properties.
			var output = [];
			for (var i = 0, f; f = files[i]; i++) {
			  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
						  f.size, ' bytes, last modified: ',
						  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
						  '</li>');
			}
			document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
		  }

		  document.getElementById('files').addEventListener('change', handleFileSelect, false);
		*/
}
