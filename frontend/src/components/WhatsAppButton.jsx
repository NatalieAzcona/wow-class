import { FloatingWhatsApp } from 'react-floating-whatsapp'

const WhatsAppButton = () => {
  return (
    <FloatingWhatsApp
      phoneNumber="34"
      accountName="WöW Class"
      statusMessage="Normalmente respondemos en pocas horas"
      chatMessage="¡Hola! ¿En qué podemos ayudarte?"
      placeholder="Escríbenos tus dudas aquí..."
    />
  )
}

export default WhatsAppButton
