if (typeof i2b2.sythndata === 'undefined') {
    i2b2.sythndata = {};
}

i2b2.sythndata.h = {};
i2b2.sythndata.h.Escape = function (inStrValue) {
    if (typeof inStrValue === "number") {
        var t = inStrValue.toString();
    } else {
        var t = new String(inStrValue);
    }
    t = t.replace(/&/g, "&amp;");
    t = t.replace(/</g, "&lt;");
    t = t.replace(/>/g, "&gt;");
    return t;
};

/**
 * REST API.
 */
i2b2.sythndata.rest = {};
i2b2.sythndata.rest.url = 'http://localhost:3005';
i2b2.sythndata.rest.fetchStaticList = function (successHandler, errorHandler) {
    $.ajax({
        type: 'GET', // For jQuery < 1.9
        method: 'GET',
        cache: false,
        dataType: 'json',
        crossDomain: 'true',
        url: i2b2.sythndata.rest.url + '/compList',
        success: successHandler,
        error: errorHandler
    });
};

i2b2.sythndata.getStaticList = function () {
    const successHandler = function (data) {
        const staticCompCheck = document.getElementById('staticCompCheck');
        for (const dat of data) {
            const label = dat.label;
            const value = dat.value;

            const inputElement = document.createElement('input');
            inputElement.className = 'form-check-input';
            inputElement.type = 'checkbox';
            inputElement.id = value;
            inputElement.name = value;
            inputElement.value = value;

            const labelElement = document.createElement('label');
            labelElement.className = 'form-check-label';
            labelElement.setAttribute('for', value);
            labelElement.innerText = label;

            const formCheck = document.createElement('div');
            formCheck.className = 'form-check';
            formCheck.appendChild(inputElement);
            formCheck.appendChild(labelElement);

            staticCompCheck.appendChild(formCheck);
        }
    };
    const errorHandler = function (err) {
        console.error(err);
    };
    i2b2.sythndata.rest.fetchStaticList(successHandler, errorHandler);
};

i2b2.sythndata.patientSetDropped = function (sdxData) {
    const title = i2b2.sythndata.h.Escape(sdxData.sdxInfo.sdxDisplayName);

    let mainDiv = document.getElementById('psmaindiv-content');
    mainDiv.innerText = title;
};


window.addEventListener("I2B2_SDX_READY", (event) => {
    i2b2.sdx.AttachType("sythndata-psmaindiv", "PRS");

    // drop event handlers used by this plugin
    i2b2.sdx.setHandlerCustom("sythndata-psmaindiv", "PRS", "DropHandler", i2b2.sythndata.patientSetDropped);
});

window.addEventListener("I2B2_READY", () => {
    $(document).ready(() => {
        i2b2.sythndata.getStaticList();
    });
});