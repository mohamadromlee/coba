    # Gunakan image dasar Nginx (web server)
    FROM nginx:latest

    # Salin file-file aplikasi web Anda ke direktori yang benar di dalam container
    COPY . /usr/share/nginx/html

    # Expose port 80 untuk akses dari luar container
    EXPOSE 80

    # Tidak perlu perintah CMD, Nginx sudah mengaturnya secara default
    