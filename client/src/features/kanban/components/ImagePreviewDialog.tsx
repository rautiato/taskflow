import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'

export type PreviewSlide = {
  src: string
  alt?: string
}

export function ImagePreviewDialog({
  open,
  slides,
  index,
  onClose,
}: {
  open: boolean
  slides: PreviewSlide[]
  index: number
  onClose: () => void
}) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={slides}
      index={index}
      plugins={[Zoom, Fullscreen, Counter]}
    />
  )
}
