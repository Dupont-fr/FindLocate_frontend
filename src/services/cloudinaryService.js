// export const uploadImageToCloudinary = async (file) => {
//   const cloudName = 'ddnolovmg'
//   const uploadPreset = 'findlocate_unsigned' // le preset "unsigned" créé dans ton compte

//   const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
//   const formData = new FormData()

//   formData.append('file', file)
//   formData.append('upload_preset', uploadPreset)

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       body: formData,
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       throw new Error(`Cloudinary error: ${errorText}`)
//     }

//     const data = await response.json()
//     console.log(' Upload Cloudinary success:', data)
//     return data.secure_url //  URL de l’image hébergée
//   } catch (err) {
//     console.error(' Erreur Cloudinary:', err)
//     throw err
//   }
// }

// src/services/cloudinaryService.js
export const uploadImageToCloudinary = async (file) => {
  const cloudName = 'ddnolovmg'
  const uploadPreset = 'findlocate_unsigned' // ✅ ton vrai preset Cloudinary

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
  const formData = new FormData()

  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Cloudinary error: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Upload Cloudinary success:', data)
    return data.secure_url
  } catch (err) {
    console.error('❌ Erreur Cloudinary:', err)
    throw err
  }
}
