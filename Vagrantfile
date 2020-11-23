Vagrant.configure("2") do |config|
    config.ssh.insert_key = false
    config.vm.box_check_update = false
    config.vm.provider "virtualbox" do |v|
        v.memory = 1024
        v.cpus = 1
    end
    config.vm.define "server_1", primary: true do |vbox|
        vbox.vm.box = "ubuntu/xenial64"
        vbox.vm.network "forwarded_port", guest: 22, host: 2222
        vbox.vm.network "private_network", ip: "192.168.33.10"
    end
    config.vm.provision "shell" do |s|
      ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
      s.inline = <<-SHELL
        echo #{ssh_pub_key} >> /home/vagrant/.ssh/authorized_keys
        echo #{ssh_pub_key} >> /root/.ssh/authorized_keys
      SHELL
    end
end