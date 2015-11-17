# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "debian/jessie64"
  config.vm.box_check_update = false

  config.vm.network "forwarded_port", guest: 4000, host: 4000

  config.vm.provision :shell,
    :privileged => true,
    :inline => "apt-get update && apt-get -y install ruby ruby-dev nodejs libffi6 libxml2 libxslt1.1 && gem install github-pages html-proofer compass --no-ri --no-rdoc"

  config.vm.provision :shell,
    :run => "always",
    :privileged => false,
    :inline => "cd /vagrant && jekyll -d -m jekyll serve -P 4000 --watch --force_polling"
end
