function UploadFileForm(){
  return(
    <>
      <form>
        <label for="target">Target</label>
        <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" /> 
      </form>
    </>
  )
}

export default UploadFileForm
