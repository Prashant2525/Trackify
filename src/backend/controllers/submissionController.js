import {v2 as cloudinary} from 'cloudinary';

// submit weekly task
const submitWeeklyTask = async (req, res) => {
    try {

        const { name, description } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];

        const projectFile1 = req.files.projectFile1 && req.files.projectFile1[0];
        const projectFile2 = req.files.projectFile2 && req.files.projectFile2[0];

        const images = [image1, image2].filter((item) => item!== undefined)
        const files = [projectFile1, projectFile2].filter((item) => item!== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path)
            })
        )
        
        console.log(name, description, images, files)

        res.status(200).json({ message: "Task submitted successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

export { submitWeeklyTask };