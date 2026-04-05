// Lightweight interactions for the article page
document.addEventListener('DOMContentLoaded', function(){
  const shareBtn = document.getElementById('shareBtn');
  const topBtn = document.getElementById('topBtn');

  if(shareBtn){
    shareBtn.addEventListener('click', async () => {
      const url = window.location.href;
      try{
        await navigator.clipboard.writeText(url);
        shareBtn.textContent = 'Copied link';
        setTimeout(()=> shareBtn.textContent = 'Share', 2000);
      }catch(e){
        // fallback: open native share if available
        if(navigator.share){
          navigator.share({title:document.title,url}).catch(()=>{});
        }else{
          alert('Copy this URL: ' + url);
        }
      }
    });
  }

  if(topBtn){
    topBtn.addEventListener('click', ()=>{
      window.scrollTo({top:0,behavior:'smooth'});
    });
  }
});
