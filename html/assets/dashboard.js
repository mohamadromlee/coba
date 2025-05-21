document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    setupDropdowns(); // Panggil fungsi setup dropdowns setelah DOM dimuat
});

function loadDashboardData() {
    const saldoElement = document.getElementById('saldoSaatIni');
    const masukElement = document.getElementById('totalDanaMasuk');
    const keluarElement = document.getElementById('totalDanaKeluar');
    const transaksiList = document.getElementById('daftarTransaksi');

    const transaksiMasuk = JSON.parse(localStorage.getItem('danaMasuk') || '[]');
    const transaksiKeluar = JSON.parse(localStorage.getItem('danaKeluar') || '[]');
    let totalMasuk = 0;
    let totalKeluar = 0;

    transaksiMasuk.forEach(item => {
        totalMasuk += parseInt(item.jumlah);
    });

    transaksiKeluar.forEach(item => {
        totalKeluar += parseInt(item.jumlah);
    });

    const saldo = totalMasuk - totalKeluar;

    saldoElement.textContent = `Rp ${saldo.toLocaleString('id-ID')}`;
    masukElement.textContent = `Rp ${totalMasuk.toLocaleString('id-ID')}`;
    keluarElement.textContent = `Rp ${totalKeluar.toLocaleString('id-ID')}`;

    const semuaTransaksi = [...transaksiMasuk.map(t => ({ ...t, jenis: 'Masuk' })), ...transaksiKeluar.map(t => ({ ...t, jenis: 'Keluar' }))];
    semuaTransaksi.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Urutkan berdasarkan tanggal terbaru

    transaksiList.innerHTML = ''; // Bersihkan daftar transaksi sebelumnya

    if (semuaTransaksi.length > 0) {
        semuaTransaksi.forEach(transaksi => {
            const row = transaksiList.insertRow();
            const tanggalCell = row.insertCell();
            const jenisCell = row.insertCell();
            const deskripsiCell = row.insertCell();
            const jumlahCell = row.insertCell();

            tanggalCell.textContent = transaksi.tanggal;
            jenisCell.textContent = transaksi.jenis;
            deskripsiCell.textContent = transaksi.deskripsi || (transaksi.sumber || transaksi.tujuan); // Menampilkan sumber/tujuan jika deskripsi kosong
            jumlahCell.textContent = `Rp ${parseInt(transaksi.jumlah).toLocaleString('id-ID')}`;
            jumlahCell.classList.add('text-right'); // Tambahkan kelas untuk perataan kanan
        });
    } else {
        const row = transaksiList.insertRow();
        const emptyCell = row.insertCell();
        emptyCell.colSpan = 4;
        emptyCell.textContent = 'Belum ada transaksi.';
        emptyCell.classList.add('text-center', 'text-gray-500');
    }
}

function setupDropdowns() {
    const dropdownLinks = document.querySelectorAll('.navigation li.dropdown > a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah link dari navigasi langsung
            const dropdownContent = this.nextElementSibling; // Mendapatkan elemen dropdown-content terkait
            
            // Toggle class 'hidden' dari Tailwind CSS untuk menampilkan/menyembunyikan
            if (dropdownContent.classList.contains('hidden')) {
                // Sembunyikan semua dropdown lain sebelum menampilkan yang ini
                document.querySelectorAll('.navigation li.dropdown .dropdown-content').forEach(content => {
                    if (content !== dropdownContent) {
                        content.classList.add('hidden');
                    }
                });
                dropdownContent.classList.remove('hidden'); // Menampilkan dropdown
            } else {
                dropdownContent.classList.add('hidden'); // Menyembunyikan dropdown
            }
        });
    });

    // Menutup dropdown ketika klik di luar area dropdown
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.navigation li.dropdown')) {
            document.querySelectorAll('.navigation li.dropdown .dropdown-content').forEach(content => {
                content.classList.add('hidden');
            });
        }
    });
}