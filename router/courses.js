const express = require('express')
const data = require('../transform')

const router = express.Router()

const detailedData = data.map(matkul => {
    const isMandatory = !matkul.nama.includes('*') //Courses with "*" are non-mandatory
    const semester = matkul.kode.charAt(4) //Semester is included in Courses code
    return {
        ...matkul,
        wajib: isMandatory,
        semester    
    }
})

const getCourseBySemester = (req, res) => {
    const { semester } = req.params
    filteredData = detailedData.filter(course => course.semester === semester)
    res.json(filteredData)
}

//Endpoints
router.get('/', (req, res) => {
    res.json(detailedData)
})

router.get('/semester/:semester', getCourseBySemester)

module.exports = router