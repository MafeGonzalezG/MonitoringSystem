import React, { useEffect, useState } from 'react';

function InputFile({SetinputFile}) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    useEffect(() => {
        SetinputFile(selectedFile);
    }, [selectedFile, SetinputFile]);
    return (
        <div>
            <label htmlFor="imageUpload" className="btn btn-primary btn-block btn-outlined">Upload Files</label>
            <input type="file" id="imageUpload" onChange={handleFileChange} style={{"display":"none"}} className="form-control form-control-sm"/>
        </div>
    );
}

export default InputFile;