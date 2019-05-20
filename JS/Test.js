window.addEventListener('load', function () {




    let name = document.querySelector('#name');
    let city = document.querySelector('#city');
    let form = document.forms[0];

    function renderCafe(doc) {
        let li = document.createElement('li');
        let namecityparent = document.createElement('div');
        let name = document.createElement('span');
        let city = document.createElement('span');
        let cross = document.createElement('div');
        let image = document.createElement('img');

        li.setAttribute('data-id', doc.id);
        namecityparent.setAttribute('id', 'contentParent');
        name.textContent = doc.data().name;
        city.textContent = doc.data().city;
        cross.textContent = "x";
        cross.setAttribute('id', 'cross');
        image.setAttribute('src',doc.data().image);

        namecityparent.appendChild(name);
        namecityparent.appendChild(city);
        li.append(image);
        li.append(namecityparent);
        li.appendChild(cross);
        document.querySelector('#cafe-list').appendChild(li);

        cross.addEventListener('click', function () {
            let docId = this.parentElement.getAttribute('data-id');
            db.collection('Cafes').doc(docId).delete().then(function () {
            })
        })
    }

    function deleteCafe(doc) {
        let li = document.querySelector(`li[data-id='${doc.id}']`);
        li.parentElement.removeChild(li);
        store.ref().child(`CafesImages/${doc.data().name}.png`).delete();
    }

    db.collection('Cafes').onSnapshot(function (snapshot) {
        let changes = snapshot.docChanges();
        changes.forEach(function (change) {
            if (change.type === "added") {
                renderCafe(change.doc);
            } else if (change.type === "removed") {
                deleteCafe(change.doc);
            }
        })
    })


    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let nameValue = name.value;
        let cityValue = city.value;
        let file = document.querySelector('#image').files[0];
        let y = store.ref().child('CafesImages').child(`${name.value}.png`);
        y.put(file).then(function () {
            y.getDownloadURL().then(function (url) {
                let x = db.collection('Cafes').doc();
                x.set({
                    name: nameValue,
                    city: cityValue,
                    image: url
                })
            })
        });
        name.value = "";
        city.value = "";
    })
});