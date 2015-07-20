var labelSrc = [],
    label    = [],
    canvasWidth  = 256,
    canvasHeight = canvasWidth,
    labelNum       = 7;

labelSrc[0] = '/assets/img/phone/icon-red-1.png',
labelSrc[1] = '/assets/img/phone/icon-red-99.png',
labelSrc[2] = '/assets/img/phone/icon-red-clean.png',
labelSrc[3] = '/assets/img/phone/icon-green-tick.png',
labelSrc[4] = '/assets/img/phone/icon-red-ex.png',
labelSrc[5] = '/assets/img/phone/icon-verified.png',
labelSrc[6] = '/assets/img/phone/icon-play.png';


 //Dom
var canvas  = [],
    context = [],
    upload  = document.getElementById('upload'),
    saveImg = document.getElementById('createImg');


for (var i = 0; i < labelNum; i++) {
  canvas[i]  = document.getElementById('canvas' + (i + 1));
  context[i] = canvas[i].getContext('2d');
  label[i]     = new Image();
  label[i].src = labelSrc[i];
}

var img = new Image; //uploaded image
var orientation = -1;

function detectSubsampling(img) {
  var iw = img.naturalWidth, ih = img.naturalHeight;
  if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, -iw + 1, 0);
    // subsampled image becomes half smaller in rendering size.
    // check alpha channel value to confirm image is covering edge pixel or not.
    // if alpha value is 0 image is not covering, hence subsampled.
    return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
  } else {
    return false;
  }
}

function transformCoordinate(ctx, orien, width, height) {
  switch (orien) {
      case 1:
          // nothing
          break;
      case 2:
          // horizontal flip
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
          break;
      case 3:
          // 180 rotate left
          ctx.translate(width, height);
          ctx.rotate(Math.PI);
          break;
      case 4:
          // vertical flip
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;
      case 5:
          // vertical flip + 90 rotate right
          ctx.rotate(0.5 * Math.PI);
          ctx.scale(1, -1);
          break;
      case 6:
          // 90 rotate right
          ctx.rotate(0.5 * Math.PI);
          ctx.translate(0, -height);
          break;
      case 7:
          // horizontal flip + 90 rotate right
          ctx.rotate(0.5 * Math.PI);
          ctx.translate(width, -height);
          ctx.scale(-1, 1);
          break;
      case 8:
          // 90 rotate left
          ctx.rotate(-0.5 * Math.PI);
          ctx.translate(-width, 0);
          break;
      default:
          break;
  }
}

function parseJpegExifOrientation(dataUrl) {
  try {
    var byteString = atob(dataUrl.split(',')[1]);
    var exif = EXIF.readFromBinaryFile(new BinaryFile(byteString));

    // Store EXIF orientation (if available) in data property.
    if (exif && exif.Orientation) {
      return exif.Orientation;
        // return exif['Orientation'];
    }
  } catch (e) {
    // Error parsing EXIF data.
    window.console && console.log('Error loading EXIF data', e);
  }
}

/**
 * Detecting vertical squash in loaded image.
 * Fixes a bug which squash image vertically while drawing into canvas for some images.
 * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
 *
 */
function detectVerticalSquash(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
            ey = py;
        } else {
            sy = py;
        }
        py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
}

/**
 * A replacement for context.drawImage
 * (args are for source and destination).
 */
function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio = detectVerticalSquash(img);
 // Works only if whole image is displayed:
 // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);

 // The following works correct also when only a part of the image is displayed:
    ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
                       sw * vertSquashRatio, sh * vertSquashRatio,
                       dx, dy, dw, dh );
}

function combinePic() {
  loadingOn(document.querySelector('.ghost')); //start loading

  var file = this.files[0],
      fr   = new FileReader();

  fr.onload = function() {
    img.src = fr.result; //the Base64 string
    img.onload = imgLoad;
  };

  fr.readAsDataURL(file);
}

function imgLoad() {
  imgCreate();
  loadingOff(document.querySelector('.ghost')); //end loading

}

function imgCreate() {
  var imgWidth  = img.width,
      imgHeight = img.height;

  for (var i = 0; i < labelNum; i++) {
    canvas[i].width  = canvasWidth;
    canvas[i].height = canvasHeight; //resizing the canvas

    var labelWidth  = label[i].width;
    var labelHeight = label[i].height;

    var ratio = canvasWidth / imgWidth; //get the scale ratio

    var scaledWidth  = canvasWidth;
    var scaledHeight = imgHeight * ratio; //scale down by proportion

    if (imgWidth > imgHeight) {
      ratio = canvasHeight / imgHeight;

      scaledHeight = canvasHeight;
      scaledWidth  = imgWidth * ratio;
    }

    context[i].clearRect(0, 0, canvas[i].width, canvas[i].height); //Clear the canvas first
    context[i].save();

    var orientation = parseJpegExifOrientation(img.src); //get the orientation
    transformCoordinate(context[i], orientation, canvasWidth, canvasHeight); //rotate the canvas

    drawImageIOSFix(context[i], img, 0, 0, imgWidth, imgHeight, 0, 0, scaledWidth, scaledHeight);//draw the uploaded image

    context[i].restore(); //restore context options, so that the followup image drew won't be rotated as well

    if (i == 5) {
      context[i].drawImage(label[i], (canvasWidth - labelWidth), (canvasHeight - labelHeight), labelWidth, labelHeight); //draw the unread label
    } else if (i == 6) {
      context[i].drawImage(label[i], (canvasWidth - labelWidth) / 2, (canvasHeight - labelHeight) / 2, labelWidth, labelHeight); //draw the unread label
    } else {
      context[i].drawImage(label[i], (canvasWidth - labelWidth), 0, labelWidth, labelHeight); //draw the unread label
    }

    var createimg = new Image; //uploaded image
    createimg.src = canvas[i].toDataURL(); //the Base64 string
    createimg.className = "cover-img";

    document.getElementById('canvasbox' + (i + 1)).appendChild(createimg);
  }


}

function loadingOn(dom) {
  dom.classList.add('loading');
}

function loadingOff(dom) {
  dom.classList.remove('loading');
}

upload.addEventListener('change', combinePic, false);
