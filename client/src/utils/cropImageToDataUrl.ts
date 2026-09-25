export type CropArea = { x: number; y: number; width: number; height: number }

// Cap the output canvas regardless of the source photo's resolution — an
// avatar never renders larger than a couple hundred px, so keeping the
// source's full pixel size would blow up the resulting data URI (and the
// localStorage quota it gets stored under) for no visual benefit.
const OUTPUT_SIZE = 256

export function cropImageToDataUrl(
  imageSrc: string,
  crop: CropArea,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_SIZE
      canvas.height = OUTPUT_SIZE
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context unavailable.'))
        return
      }
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
      )
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    image.onerror = () => reject(new Error('Unable to load image.'))
    image.src = imageSrc
  })
}
