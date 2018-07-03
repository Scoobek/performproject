/**
 * Check if HTML tag exist in html cavnas.
 * @param {Object} htmlObject - html element of existing object.
 * @returns {boolean}
 */
const isTagExist = (htmlObject) => {
    return (htmlObject != undefined || htmlObject != null);
};

/**
 * Check if tag has correct attributes.
 * @param {Object} htmlObject - html element of existing object.
 * @returns {boolean}
 */
const hasTagAttributes = (htmlObject) => {
    return (htmlObject.hasAttribute("data-user") && htmlObject.hasAttribute("data-update"));
};

/**
 * Checking if data attribute has correct date, means date isnt forward and has good syntax
 * @param {string} attributeValue - value data-update attribute.
 * @returns {boolean}
 */
const isDataCorrect = (attributeValue) => {
    return (new Date(attributeValue) && new Date(attributeValue) < Date.now());
};

/**
 * Checking if data user attribute value isnt empty string.
 * @param {string} attributeValue - value data-user attribute.
 * @returns {boolean}
 */
const isUserStringNotEmpty = (attributeValue) => {
    return (attributeValue != "" && attributeValue != null);
};

/**
 * Assign to date object format.
 * @param {string} value - variable to assign.
 * @returns {Object} represents new Date object
 */
const setDataType = (value) => {
    return new Date(value)
};

/**
 * Asynchronous function for fetching data from github api about user's repositories.
 * @param {string} user - name of searching user's repository.
 * @returns {object} object converted to json type.
 */
const fetchRepoByUser = async (user) => {
    const api_call = await fetch(`https://api.github.com/users/${user}/repos`);

    const data = await api_call.json();

    return {
        data
    };
};

/**
 * Create a markup of html table element with prepered data.
 * @param {repositoryObject[]} objectArray - prepered array of objects to display.
 * @returns {string} prepered data table to append to HTML document.
 */
const createTableElement = (objectArray) => {
    const markup = `<table>
        <thead>
            <tr>
                <th>Repository name</th>
                <th>Repository description</th>
                <th>Last update</th>
                <th>Repository url</th>
            </tr>
        </thead>
        <tbody>${objectArray.map(repositoryObject => `<tr><td class="col-name">${repositoryObject.name}</td><td class="col-description">${repositoryObject.description}</td><td class="col-updated">${repositoryObject.updated}</td><td class="col-url">${repositoryObject.cloneUrl}</td></tr>`).join('')}</tbody></table>`;
    return markup;
};

/**
 * Replace Z and T chars to white space.
 * @param {repositoryObject[]} objectArray - prepered array of objects to display.
 * @returns {repositoryObject[]} dataArray - prepered data table of objects with changes in update variable.
 */
const dataUpdateTimeProcessing = (dataArray) => {
    for (const repositoryObject of dataArray) {
        repositoryObject.updated = repositoryObject.updated.replace(/Z|T/gi, (char) => char = " ");
    }
    return dataArray;
}

/**
 * Add a created component to DOM
 * @param {Object} parentNode - document element where child element has to be add.
 * @param {Object} child - prepered document element to attach to parentNode.
 */
const addElementToContent = (parentNode, child) => {
    parentNode.appendChild(child);
}

const run = setInterval(() => {
    const reposTag = document.querySelector("repos");

    if (isTagExist(reposTag)) {
        if (hasTagAttributes(reposTag)) {
            const reposTagDataUser = reposTag.getAttribute("data-user");
            const reposTagDataUpdate = reposTag.getAttribute("data-update");
            const mainElement = document.querySelector('main');

            if (isDataCorrect(reposTagDataUpdate) && isUserStringNotEmpty(reposTagDataUser)) {
                mainElement.removeChild(reposTag);

                fetchRepoByUser(reposTagDataUser)
                    .then((res) => {
                        const divElement = document.createElement("div");
                        const pElement = document.createElement("p");

                        divElement.classList.add("table-content");
                        pElement.classList.add("user");

                        dataObjectArray = Object.entries(res.data).map(
                            ([key, value]) => {
                                if (setDataType(value.updated_at) > setDataType(reposTagDataUpdate)) {
                                    const repositoryObject = {
                                        "name": value.name,
                                        "cloneUrl": value.clone_url,
                                        "description": value.description,
                                        "updated": value.updated_at
                                    }
                                    return repositoryObject;
                                }
                            }).filter((repositoryObject) => repositoryObject != undefined);
                        
                        dataObjectArray = dataUpdateTimeProcessing(dataObjectArray);                       

                        pElement.innerHTML = `Repository owner: ${reposTagDataUser}`
                        divElement.innerHTML = createTableElement(dataObjectArray);

                        addElementToContent(mainElement, pElement);
                        addElementToContent(mainElement, divElement);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } else {
                console.log('err');
            }
        }
    } else {
        console.log('err')
    }
}, 1000);