AFRAME.registerComponent("createmarkers",{
    init: async function (){
        var mainScene = document.querySelector("#main-scene")
        var toys = await this.getAllToys()
        toys.map(toy => {
            var marker = document.createElement("a-marker");
            marker.setAttribute("id", toy.id);
            marker.setAttribute("type","pattern");
            marker.setAttribute("url", toy.marker_pattern_url);
            marker.setAttribute("cursor",{
                rayOrigin:"mouse"
            });
            marker.setAttribute("markerhandler",{});
            mainScene.appendChild(marker);

            // Adding 3D model to scene
            var model = document.createElement("a-entity");
            model.setAttribute("id",`model-${toy.id}`);
            model.setAttribute("position", toy.model_geometry.position);
            model.setAttribute("rotation", toy.model_geometry.rotation);
            model.setAttribute("scale", toy.model_geometry.scale);
            model.setAttribute("gltf-model",`url(${toy.model_url})`);
            model.setAttribute("gesture-handler",{});
            model.setAttribute("animation-mixer",{});
            marker.appendChild(model)

            // descriptions Container
            var mainPlane = document.createElement("a-plane");
            mainPlane.setAttribute("id", `main-plane-${toy.id}`);
            mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
            mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
            mainPlane.setAttribute("width", 1.7);
            mainPlane.setAttribute("height", 1.5);
            mainPlane.setAttribute("visible", false);
            marker.appendChild(mainPlane);

            // toy title background plane
            var titlePlane = document.createElement("a-plane");
            titlePlane.setAttribute("id", `title-plane-${toy.id}`);
            titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
            titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            titlePlane.setAttribute("width", 1.69);
            titlePlane.setAttribute("height", 0.3);
            titlePlane.setAttribute("material", { color: "#F0C30F" });
            mainPlane.appendChild(titlePlane);

            // toy title
            var toyTitle = document.createElement("a-entity");
            toyTitle.setAttribute("id", `toy-title-${toy.id}`);
            toyTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
            toyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            toyTitle.setAttribute("text", {
            font: "monoid",
            color: "black",
            width: 1.8,
            height: 1,
            align: "center",
            value: toy.name.toUpperCase()
            });
            titlePlane.appendChild(toyTitle);

            // descriptions List
            var descriptions = document.createElement("a-entity");
            descriptions.setAttribute("id", `descriptions-${toy.id}`);
            descriptions.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
            descriptions.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            descriptions.setAttribute("text", {
                font: "monoid",
                color: "black",
                width: 2,
                align: "left",
                value: `${toy.description}`
            });
            mainPlane.appendChild(descriptions);

            // Age List
            var ageGroup = document.createElement("a-entity");
            ageGroup.setAttribute("id", `descriptions-${toy.id}`);
            ageGroup.setAttribute("position", { x: 0.3, y: 0.5, z: 0.1 });
            ageGroup.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            ageGroup.setAttribute("text", {
                font: "monoid",
                color: "black",
                width: 2,
                align: "left",
                value: `${toy.age_group}`
            });
            mainPlane.appendChild(ageGroup);

        })
    },
    getAllToys: async function(){
        return await firebase
        .firestore()
        .collection()
        .get()
        .then(snap => {
            return snap.docs.map(doc => doc.data)
        })
    }
})