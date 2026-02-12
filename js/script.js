document.addEventListener('DOMContentLoaded', () => {
  const downloadForm = document.getElementById('downloadForm');
  const downloadBtn = document.getElementById('downloadBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const resultSection = document.getElementById('resultSection');
  const videoPreview = document.getElementById('videoPreview');
  const videoTitle = document.getElementById('videoTitle');
  const downloadLink = document.getElementById('downloadLink');
  const downloadAudioLink = document.getElementById('downloadAudioLink');
  const statusText = document.getElementById('statusText');
  const errorMessage = document.getElementById('errorMessage');

  if (!downloadForm) return;

  const APIS = [
    {
      name: 'TikWM',
      fetch: fetchViaTikWM
    },
    {
      name: 'TikMate',
      fetch: fetchViaTikMate
    }
  ];

  downloadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const urlInput = document.getElementById('tiktokUrl');
    const tiktokUrl = (urlInput?.value || '').trim();

    clearError();

    if (!tiktokUrl) {
      showError('Masukkan URL TikTok dulu.');
      return;
    }

    if (!isValidTikTokUrl(tiktokUrl)) {
      showError('URL tidak valid. Pastikan link berasal dari tiktok.com.');
      return;
    }

    const downloadType = getSelectedDownloadType();
    setLoading(true, 'Mengambil info video...');

    try {
      let lastErr;

      for (const api of APIS) {
        try {
          if (downloadType === 'audio' && api.name !== 'TikWM') continue;
          setLoading(true, `Mencoba ${api.name}...`);
          const result = await api.fetch(tiktokUrl);
          if (!result?.videoUrl) throw new Error('Video URL kosong dari API');
          showResult(result, downloadType);
          return;
        } catch (err) {
          lastErr = err;
        }
      }

      throw lastErr || new Error('Gagal mengambil video dari semua API.');
    } catch (err) {
      const msg = normalizeError(err);
      showError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  function showResult(result, downloadType) {
    const title = result.title || 'TikTok Video';
    videoTitle.textContent = title;

    const resultTitleEl = document.getElementById('resultTitle');
    if (resultTitleEl) {
      resultTitleEl.textContent = downloadType === 'audio' ? 'Audio siap diunduh!' : 'Video siap diunduh!';
    }

    const ts = Date.now();
    const videoFilename = `toknify_${ts}.mp4`;
    const audioExt = (result.audioUrl && /\.m4a(\?|$)/i.test(result.audioUrl)) ? 'm4a' : 'mp3';
    const audioFilename = `toknify_${ts}.${audioExt}`;

    downloadLink.href = result.videoUrl;
    downloadLink.download = videoFilename;

    const audioUrl = result.audioUrl;
    if (downloadAudioLink) {
      if (audioUrl) {
        downloadAudioLink.href = audioUrl;
        downloadAudioLink.download = audioFilename;
        downloadAudioLink.classList.remove('hidden');
        downloadAudioLink.setAttribute('aria-disabled', 'false');
      } else {
        downloadAudioLink.href = '#';
        downloadAudioLink.download = '';
        downloadAudioLink.classList.add('hidden');
        downloadAudioLink.setAttribute('aria-disabled', 'true');
      }
    }

    // Preview hanya untuk mode video
    if (videoPreview) {
      if (downloadType === 'video') {
        videoPreview.classList.remove('hidden');
        videoPreview.src = result.videoUrl;
      } else {
        videoPreview.pause?.();
        videoPreview.removeAttribute('src');
        videoPreview.load();
        videoPreview.classList.add('hidden');
      }
    }

    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Auto-download sesuai pilihan (tetap ada tombol manual kalau browser memblok)
    if (downloadType === 'audio') {
      if (!audioUrl) {
        showError('Audio tidak tersedia untuk video ini. Coba pilih Video.');
        return;
      }
      attemptAutoDownload(audioUrl, audioFilename);
    } else {
      attemptAutoDownload(result.videoUrl, videoFilename);
    }
  }

  function getSelectedDownloadType() {
    const selected = document.querySelector('input[name="downloadType"]:checked');
    if (!selected) return 'video';
    return selected.value === 'audio' ? 'audio' : 'video';
  }

  function attemptAutoDownload(url, filename) {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    } catch {
      return false;
    }
  }

  function setLoading(isLoading, text) {
    if (typeof text === 'string' && statusText) statusText.textContent = text;

    if (loadingSpinner) {
      loadingSpinner.classList.toggle('active', Boolean(isLoading));
    }

    if (downloadBtn) {
      downloadBtn.disabled = Boolean(isLoading);
      downloadBtn.innerHTML = isLoading
        ? '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>'
        : '<i class="fas fa-download"></i><span>Download</span>';
    }
  }

  function clearError() {
    if (!errorMessage) return;
    errorMessage.className = 'hidden';
    errorMessage.innerHTML = '';
  }

  function showError(message) {
    if (!errorMessage) return;

    errorMessage.className = 'error-message fade-in';
    errorMessage.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${escapeHtml(message)}</span>
    `;

    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function isValidTikTokUrl(url) {
    try {
      const u = new URL(url);
      return u.hostname.includes('tiktok.com');
    } catch {
      return false;
    }
  }

  function normalizeError(err) {
    if (!err) return 'Terjadi error.';
    if (typeof err === 'string') return err;
    if (err instanceof Error) {
      // CORS dari browser biasanya muncul sebagai TypeError: Failed to fetch
      if (/failed to fetch/i.test(err.message)) {
        return 'Gagal request ke API (kemungkinan diblok CORS / API down). Coba hosting web ini (jangan buka via file:///), lalu coba lagi.';
      }
      return err.message;
    }
    return 'Terjadi error.';
  }

  async function fetchViaTikWM(tiktokUrl) {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`;

    const res = await fetch(apiUrl, {
      method: 'GET'
    });

    if (!res.ok) throw new Error(`TikWM error: HTTP ${res.status}`);

    const data = await res.json();
    if (data?.code !== 0) throw new Error(data?.msg || 'TikWM: response tidak valid');

    const videoUrl = data?.data?.play || data?.data?.hdplay || data?.data?.wmplay;
    const title = data?.data?.title || 'TikTok Video';

    const audioUrl =
      data?.data?.music ||
      data?.data?.music_url ||
      data?.data?.music_info?.play ||
      data?.data?.music_info?.url ||
      data?.data?.music_info?.music ||
      null;

    if (!videoUrl) throw new Error('TikWM: video url tidak ditemukan');

    return { videoUrl, title, audioUrl };
  }

  async function fetchViaTikMate(tiktokUrl) {
    const apiUrl = 'https://api.tikmate.app/api/convert';
    const formData = new FormData();
    formData.append('url', tiktokUrl);

    const res = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error(`TikMate error: HTTP ${res.status}`);

    const data = await res.json();

    // TikMate biasanya return: { token, id, ... }
    if (!data?.token || !data?.id) {
      // beberapa mirror return langsung { url }
      if (data?.url) return { videoUrl: data.url, title: data?.title || 'TikTok Video' };
      throw new Error('TikMate: response tidak valid');
    }

    const videoUrl = `https://tikmate.app/download/${data.token}/${data.id}.mp4`;
    const title = data?.title || 'TikTok Video';

    return { videoUrl, title };
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
});
