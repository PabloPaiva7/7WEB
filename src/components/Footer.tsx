
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#F6F6F7] dark:bg-[#222] mt-auto py-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre Nós */}
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-[#D9B300]">Sobre Nós</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A SETE CAPITAL é especialista em soluções financeiras personalizadas, 
              ajudando nossos clientes a alcançarem seus objetivos com excelência e compromisso.
            </p>
            <div className="flex space-x-3">
              <Link to="#" className="hover:text-primary transition-colors">
                <Instagram size={18} />
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                <Facebook size={18} />
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                <Twitter size={18} />
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>
          
          {/* Links Essenciais */}
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-[#D9B300]">Links Essenciais</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/ajuda" className="text-muted-foreground hover:text-primary transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-[#D9B300]">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                <span>Av. Paulista, 1000 - São Paulo, SP</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <span>(11) 4002-8922</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <span>contato@setecapital.com.br</span>
              </li>
            </ul>
          </div>
          
          {/* Horário de Atendimento */}
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-[#D9B300]">Horário de Atendimento</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Segunda a Sexta: 8:00 - 18:00
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Aos Sábados: 9:00 - 13:00
            </p>
            <Link to="/contato" className="text-sm font-medium hover:underline text-primary">
              Solicitar atendimento
            </Link>
          </div>
        </div>
        
        <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} SETE CAPITAL. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Desenvolvido com ❤️ no Brasil</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
