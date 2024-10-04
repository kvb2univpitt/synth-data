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
 * Modals.
 */
i2b2.sythndata.modal = {};
// message modals
i2b2.sythndata.modal.message = {};
i2b2.sythndata.modal.message.show = function (title, message) {
    $('#sythndata-message-modal-title').text(title);
    $('#sythndata-message-modal-message').text(message);
    $('#sythndata-message-modal').modal('show');
};
// progress modals
i2b2.sythndata.modal.progress = {};
i2b2.sythndata.modal.progress.show = function (title) {
    $('#sythndata-progress-modal-title').text(title);
    $('#sythndata-progress-modal').modal('show');
};
i2b2.sythndata.modal.progress.hide = function () {
    $('#sythndata-progress-modal').modal('hide');
};
// confirm modals
i2b2.sythndata.modal.confirm = {};
i2b2.sythndata.modal.confirm.show = function (title, message) {
    $('#sythndata-confirm-modal-title').text(title);
    $('#sythndata-confirm-modal-message').html(message);
    $('#sythndata-confirm-modal').modal('show');
};

/**
 * Tabs
 */
i2b2.sythndata.tab = {};
i2b2.sythndata.tab.enable = function (id) {
    $(id).removeClass('disabled');
};
i2b2.sythndata.tab.disable = function (id) {
    $(id).addClass('disabled');
};
i2b2.sythndata.tab.setFocus = function (id) {
    $(id).click();
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
i2b2.sythndata.rest.fetchDemographicData = function (data, successHandler, errorHandler) {
    $.ajax({
        type: 'get',
        contentType: 'application/json',
        url: i2b2.sythndata.rest.url + '/demographicData',
        data: data,
        success: successHandler,
        error: errorHandler
    });
};
i2b2.sythndata.rest.fetchLastData = function (patient_set_id, successHandler, errorHandler) {
    $.ajax({
        type: 'get',
        contentType: 'application/json',
        url: i2b2.sythndata.rest.url + '/lastTask/' + patient_set_id,
        success: successHandler,
        error: errorHandler
    });
};
i2b2.sythndata.rest.generateSynthData = function (data, successHandler, errorHandler) {
    $.ajax({
        type: 'post',
        contentType: 'application/json',
        processData: false,
        url: i2b2.sythndata.rest.url + '/generateSynthData',
        data: data,
        success: successHandler,
        error: errorHandler
    });
};
i2b2.sythndata.rest.getProgressStatus = function (taskURL, successHandler, errorHandler) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        crossDomain: 'true',
        url: i2b2.sythndata.rest.url + taskURL,
        success: successHandler,
        error: errorHandler
    });
};

/**
 * Event handlers.
 */
i2b2.sythndata.event = {};
i2b2.sythndata.event.onclickRun = function () {
    let taskStatus = i2b2.model.currentTask && i2b2.model.currentTask.status;
    if (taskStatus) {
        if (taskStatus === 'in-progress') {
            i2b2.sythndata.modal.message.show('Generating Data', 'Synthetic data generation is already in progress.');
        } else if (taskStatus === 'success') {
            if (!i2b2.model.currentTask.fileDownloaded) {
                const title = 'Previous Result Not Downloaded';
                const message = '<p>You have not downloaded results of the previous run.</p>'
                        + '<p class="fw-bold">Do you want to continue?</p>';
                i2b2.sythndata.modal.confirm.show(title, message);
            }
        }
    } else {
        i2b2.sythndata.runQuery();
    }
};
i2b2.sythndata.event.onclickContinue = function () {
    const origData = i2b2.model.currentRec.origData;

    new Promise((resolve, reject) => {
        const successHandler = function (data) {
            resolve(data);
        };
        const errorHandler = function (err) {
            console.error(err);
            reject(err);
        };
        i2b2.sythndata.rest.fetchLastData(origData.PRS_id, successHandler, errorHandler);
    }).then((data) => {
        if (data.status === 'NONE') {
            i2b2.sythndata.modal.message.show('Continue Run Error', 'No previous run found for the patient set.');
            return;
        }
    });
};

// initiate a synthetic dataset processing job.
i2b2.sythndata.postMessage = function (patient_set_id, sc_value, ttest_value, st_test_value) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            patient_set_id,
            st_test_value
        });
        const successHandler = function (data) {
            resolve(data);
        };
        const errorHandler = function (err) {
            console.error(err);
            reject(err);
        };
        i2b2.sythndata.rest.generateSynthData(data, successHandler, errorHandler);
    });
};

i2b2.sythndata.progressBar = {};
i2b2.sythndata.progressBar.setValue = function (percentage) {
    $('#dataGenProgress').attr('aria-valuenow', percentage);
    if (percentage === 0) {
        $('#dataGenProgressBar').css('width', 0).text('');
    } else {
        $('#dataGenProgressBar').css('width', percentage + '%').text(`${percentage}%`);
    }
};
i2b2.sythndata.progressBar.setValueWithDescription = function (percentage, description) {
    i2b2.sythndata.progressBar.setValue(percentage);
    $('#progressStep').text(description);
};
i2b2.sythndata.progressBar.reset = function () {
    setTimeout(() => {
        i2b2.sythndata.progressBar.setValueWithDescription(0, '');
    }, 500);
};

// update progress bar in UI.
i2b2.sythndata.updateProgress = function (progress) {
    const meta_value = progress.current_step;
    const meta_total = progress.total_steps;
    const meta_progress = (meta_value / meta_total) * 100;
    const meta_text = progress.step_description;

    // update progress bar value from progress data
    i2b2.sythndata.progressBar.setValueWithDescription(meta_progress, meta_text);
};

i2b2.sythndata.checkStatus = function (taskURL) {
    return new Promise((resolve, reject) => {
        const sendRequest = function () {
            const successHandler = function (data) {
                if (data.state === 'SUCCESS') {
                    resolve(data);
                } else if (data.state === 'FAILURE') {
                    reject(data);
                } else {
                    if (data.state === 'PROGRESS') {
                        i2b2.sythndata.updateProgress(data.meta);
                    }
                    setTimeout(sendRequest, 5000);
                }
            };
            const errorHandler = function (err) {
                console.error(err);
                reject(err);
            };
            i2b2.sythndata.rest.getProgressStatus(taskURL, successHandler, errorHandler);
        };

        sendRequest();
    });
};

i2b2.sythndata.progressSyntheticDataGeneration = function (taskURL, inprogress) {
    const serverURL = this.synthServer;
    const origData = i2b2.model.currentRec.origData;

    i2b2.model.currentTask = {
        status: "in-progress",
        setId: origData.PRS_id
    };

    i2b2.sythndata.progressBar.reset();

    const msg = inprogress ? "Retrieving in-progress process on server" : "Initializing processing on server";
    $('#progressStep').text(msg);

    // promise will not resolve now until job is complete.
    i2b2.sythndata.checkStatus(taskURL).then((data) => {
        i2b2.model.currentTask.status = "success";
        const results = JSON.parse(data.results);
        console.info("================================================================================");
        console.info(results);
        console.info("================================================================================");
//        i2b2.sythndata.successSyntheticDataGeneration(results);
        i2b2.sythndata.progressBar.reset();
    }, (errorMessage) => {
        i2b2.model.currentTask.status = "failure";

        console.log(errorMessage);
        alert('Error - The data generation failed.');
//        jQuery("#syntheticData-Complete").hide();
//        jQuery("#syntheticData-Loading").hide();
//        jQuery('#demographic-status').hide();
//        jQuery("#syntheticData-NoData").show();
        i2b2.sythndata.progressBar.reset();
    });
};

i2b2.sythndata.runSyntheticDataGeneration = function () {
    const origData = i2b2.model.currentRec.origData;
    i2b2.sythndata.postMessage(origData.PRS_id, origData.sc_value, origData.ttest_value, origData.st_test_value).then((postResult) => {
        const taskURL = postResult.location;
        const inprogress = postResult.inprogress;

        i2b2.sythndata.progressSyntheticDataGeneration(taskURL, inprogress);
    }).catch((error) => {
        alert("Error: Internal Server Error")
        console.log(error);
    });
    $('#progressStatus').show();
};

i2b2.sythndata.runDemogProgress = async function () {
    let percentage = 0;
    for (let i = 0; i < 15; i++) {
        // Takes abouot 7 seconds
        if (percentage < 75) {
            percentage += 13;
        } else {
            percentage += (100 - percentage) / 2;
        }

        i2b2.sythndata.progressBar.setValue(percentage);
        await new Promise(r => setTimeout(r, 1000));
    }
};

i2b2.sythndata.getDemographicData = function (patientSetId, sc_value, ttest_value) {
    return new Promise((resolve, reject) => {
        const data = {
            'patient_set_id': patientSetId,
            'static_variable': sc_value,
            'ttest_variable': ttest_value
        };
        const successHandler = function (data) {
            resolve(data);
        };
        const errorHandler = function (err) {
            console.error(err);
            reject(err);
        };

        i2b2.sythndata.rest.fetchDemographicData(data, successHandler, errorHandler);
    });
};

i2b2.sythndata.showDemographicInfo = function (demographicData) {
    // reset previous data
    $('#stat-test').hide();
    $('#stat-compare').hide();
    $('#patientCounts').text('');

    // clear plots
    document.getElementById('stat-test-plot').innerHTML = '';
    document.getElementById('stat-compare-checks').innerHTML = '';

    $('#patientCounts').text(`N(patients) size = ${demographicData.total_size.toLocaleString("en-US")}`);

    const disableSynthesize = (demographicData.total_size < 100);
    $("#startSynth").prop("disabled", disableSynthesize);
    $("#cancelSynth").prop("disabled", disableSynthesize);

    if (demographicData.static_result) {
        const staticCompChecks = document.getElementById('stat-compare-checks');
        for (const dat of demographicData.static_result.values) {
            const label = `N(${dat.label}) = ${dat.count.toLocaleString("en-US")}`;
            const value = dat.value;
            const id = `${value}Radio`;
            const count = dat.count;
            const checked = (count >= 100);
            const disabled = (dat.count < 100);

            // <input class="form-check-input" type="checkbox" value="{value}" id="{id}" name="{id}" />
            const inputElement = document.createElement('input');
            inputElement.className = 'form-check-input';
            inputElement.type = 'checkbox';
            inputElement.id = id;
            inputElement.name = id;
            inputElement.value = value;
            inputElement.checked = checked;
            inputElement.disabled = disabled;

            // <label class="form-check-label" for="{value}">{label}</label>
            const labelElement = document.createElement('label');
            labelElement.className = 'form-check-label';
            labelElement.for = id;
            labelElement.innerText = label;
            if (disabled) {
                labelElement.title = 'Unable to use because population is under threshold.';
            }

            // <div class="form-check">
            const formCheck = document.createElement('div');
            formCheck.className = 'form-check';
            formCheck.appendChild(inputElement);
            formCheck.appendChild(labelElement);

            staticCompChecks.appendChild(formCheck);
        }

        $('#stat-compare').show();
    }
    if (demographicData.ttest_result) {
        $('#stat-test').show();
        const ttest = demographicData.ttest_result;
        i2b2.sythndata.boxAndWhiskerPlot('stat-test-plot', ttest.values, ttest.ttest_label, `Box and Whisker: ${ttest.ttest_label}`, 0);
    }

    $('#progressStatus').hide();
    $('#demographicStatus').show();
    i2b2.sythndata.tab.enable('#nav-data-tab');
};

i2b2.sythndata.runQuery = function () {
    if (!i2b2.model.currentRec) {
        i2b2.sythndata.modal.message.show('Run Failed', 'Please provide a patient set.');
        return;
    }
    if (!i2b2.model.currentRec.origData) {
        i2b2.sythndata.modal.message.show('Run Failed', 'No original data found on entry.');
        return;
    }
    if (!i2b2.model.currentRec.origData.PRS_id) {
        i2b2.sythndata.modal.message.show('Run Failed', 'No PRS identifier found on entry.');
        return;
    }

    const origData = i2b2.model.currentRec.origData;
    const patientSetId = origData.PRS_id;

    // get user inputs
    const sc_value = $('input[name="statComparison"]:checked').val();
    const ttest_value = $('input[name="statTestAge"]:checked').val();
    const st_test_value = $('#statTest').find(":selected").val();

    // set attributes from user inputs
    origData.sc_value = sc_value ? sc_value : null;
    origData.ttest_value = ttest_value ? ttest_value : null;
    origData.st_test_value = st_test_value ? st_test_value : null;

    // switch to the view-result tab
    i2b2.sythndata.tab.disable('#nav-data-tab');
    i2b2.sythndata.tab.enable('#nav-results-tab');
    i2b2.sythndata.tab.setFocus('#nav-results-tab');

    if (origData.sc_value || origData.ttest_value) {
        $('#progressStatus').show();

        i2b2.sythndata.runDemogProgress();

        // post and await response for URL.
        i2b2.model.currentTask = {
            status: "in-progress",
            setId: patientSetId
        };
        i2b2.sythndata.getDemographicData(patientSetId, origData.sc_value, origData.ttest_value).then(demographicData => {
            i2b2.model.currentTask = null;
            i2b2.sythndata.showDemographicInfo(demographicData);
        }).catch((error) => {
            i2b2.model.currentTask = null;
            alert("Error: Internal server error")
            console.log(error);
        });
    } else {
        i2b2.sythndata.runSyntheticDataGeneration();
    }

    i2b2.sythndata.tab.enable('#nav-data-tab');
};

i2b2.sythndata.createRadioButton = function (radioName, label, value, id, checked) {
    // <div class="form-check">
    const divElement = document.createElement('div');
    divElement.className = 'form-check';

    // <input class="form-check-input" type="radio" name="statComparison" id="{value}" value="{value}" />
    const inputElement = document.createElement('input');
    inputElement.className = 'form-check-input';
    inputElement.type = 'radio';
    inputElement.id = id;
    inputElement.name = radioName;
    inputElement.value = value;
    inputElement.checked = checked;

    // <label class="form-check-label" for="{value}">{label}</label>
    const labelElement = document.createElement('label');
    labelElement.className = 'form-check-label';
    labelElement.setAttribute('for', id);
    labelElement.innerText = label;

    const formRadio = document.createElement('div');
    formRadio.className = 'form-check';
    formRadio.appendChild(inputElement);
    formRadio.appendChild(labelElement);

    return formRadio;
};

i2b2.sythndata.getStaticList = function () {
    const successHandler = function (data) {
        const staticCompCheck = document.getElementById('staticCompCheck');
        const radioName = 'statComparison';

        // option for selecting none
        const noneRadio = i2b2.sythndata.createRadioButton(radioName, 'None', '', 'none', true);
        staticCompCheck.appendChild(noneRadio);

        // options
        for (const dat of data) {
            const label = dat.label;
            const value = dat.value;
            const id = `${value}Radio`;

            const formRadio = i2b2.sythndata.createRadioButton(radioName, label, value, id, false);

            staticCompCheck.appendChild(formRadio);
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

    i2b2.model.currentRec = sdxData;

    document.getElementById('runQuery').disabled = false;
    document.getElementById('continueLast').disabled = false;
};


window.addEventListener("I2B2_SDX_READY", (event) => {
    i2b2.sdx.AttachType("sythndata-psmaindiv", "PRS");

    // drop event handlers used by this plugin
    i2b2.sdx.setHandlerCustom("sythndata-psmaindiv", "PRS", "DropHandler", i2b2.sythndata.patientSetDropped);
});

window.addEventListener("I2B2_READY", () => {
    $(document).ready(() => {
        // initialize model
        i2b2.model.currentRec = null;
        i2b2.model.currentTask = null;

        i2b2.sythndata.getStaticList();

        $('#runQuery').click(i2b2.sythndata.event.onclickRun);
        $('#continueLast').click(i2b2.sythndata.event.onclickContinue);
    });
});