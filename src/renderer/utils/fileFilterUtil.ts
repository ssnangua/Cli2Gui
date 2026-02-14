import { FileFilter } from 'electron'

const split = (...args): string[] => args.join(',').split(',')

/**
 * 常用文件类型过滤器
 * @see https://github.com/dyne/file-extension-list
 */
export const commonFileFiterMap: Record<string, FileFilter> = {
  image: {
    name: 'editor.fileFiltersEditor.image',
    extensions: split(
      'ico,3dm,3ds,max,avif,bmp,dds,gif,heic,heif,jpg,jpeg,jxl,png,psd,xcf,tga,thm,tif,tiff,yuv,ai,eps,ps,svg,dwg,dxf,gpx,kml,kmz,webp'
    )
  },
  video: {
    name: 'editor.fileFiltersEditor.video',
    extensions: split(
      '3g2,3gp,aaf,asf,avchd,avi,car,dav,drc,flv,m2v,m2ts,m4p,m4v,mkv,mng,mov,mp2,mp4,mpe,mpeg,mpg,mpv,mts,mxf,nsv,ogv,ogm,ogx,qt,rm,rmvb,roq,srt,svi,vob,webm,wmv,xba,yuv'
    )
  },
  audio: {
    name: 'editor.fileFiltersEditor.audio',
    extensions: split(
      'aac,aiff,ape,au,flac,gsm,it,m3u,m4a,mid,mod,mp3,mpa,ogg,opus,pls,ra,s3m,sid,wav,wma,xm'
    )
  },
  text: {
    name: 'editor.fileFiltersEditor.text',
    extensions: split('doc,docx,ebook,log,md,msg,odt,org,pages,pdf,rtf,rst,tex,txt,wpd,wps')
  },
  allFiles: {
    name: 'editor.fileFiltersEditor.allFiles',
    extensions: ['*']
  }
}

export const commonFileFilters: FileFilter[] = Object.values(commonFileFiterMap)

/**
 * 根据文件类型过滤器获取正则表达式
 * @param filters 文件类型数组
 * @returns 正则表达式
 */
export function getRuleFromFileFilters(filters: FileFilter[]): RegExp | undefined {
  if (filters.length === 0) return undefined
  // 如果有一个过滤器包含所有文件类型，则不进行过滤
  return filters.some((filter) => filter.extensions.includes('*'))
    ? undefined
    : // 否则，通过正则表达式匹配文件类型过滤器中所有的扩展名
      new RegExp(
        `\\.(${filters
          .map((filter) => filter.extensions)
          .flat()
          .join('|')})$`,
        'i'
      )
}
