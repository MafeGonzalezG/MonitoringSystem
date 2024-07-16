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
            <input type="file" onChange={handleFileChange} className="form-control form-control-sm"/>
        </div>
    );
}

export default InputFile;