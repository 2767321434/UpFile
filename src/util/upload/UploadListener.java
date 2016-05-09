package util.upload;

import org.apache.commons.fileupload.ProgressListener;
/**
 * 上传过程的监听器
 * 
 *
 */
public class UploadListener implements ProgressListener{

	private volatile long 
	bytesRead = 0L,//上传的字节数
	contentLength = 0L,//总字节数
	item = 0L; 
	

	 public UploadListener() 
	    {
	    	super();
	    }
	 
	 
	 public void update(long aBytesRead, long aContentLength, int anItem) {
	 	
	 	bytesRead = aBytesRead;
	     contentLength = aContentLength;
	     item = anItem;
	 }
	 public long getBytesRead() 
	 {
	     return bytesRead;
	 }
	 public long getContentLength() 
	 {
	     return contentLength;
	 }

	 public long getItem() 
	 {
	     return item;
	 }
	  

}
