import java.util.Scanner;

/**
 * CODEQUEST - Module 01 : Conditions
 * CORRECTION : Le Distributeur de Boissons
 * 
 * ⚠️ FICHIER ENSEIGNANT — NE PAS DISTRIBUER AUX ÉTUDIANTS
 */
public class Distributeur_CORRECTION {
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.println("╔═══════════════════════════╗");
        System.out.println("║   DISTRIBUTEUR CODEQUEST  ║");
        System.out.println("╠═══════════════════════════╣");
        System.out.println("║  1. Café       (2.50 CHF) ║");
        System.out.println("║  2. Thé        (2.00 CHF) ║");
        System.out.println("║  3. Chocolat   (3.00 CHF) ║");
        System.out.println("║  4. Jus orange (3.50 CHF) ║");
        System.out.println("╚═══════════════════════════╝");
        
        System.out.print("Votre choix (1-4) : ");
        int choix = sc.nextInt();
        
        // SWITCH pour déterminer nom et prix
        String nom = "";
        double prix = 0;
        
        switch (choix) {
            case 1:
                nom = "Café";
                prix = 2.50;
                break;
            case 2:
                nom = "Thé";
                prix = 2.00;
                break;
            case 3:
                nom = "Chocolat";
                prix = 3.00;
                break;
            case 4:
                nom = "Jus d'orange";
                prix = 3.50;
                break;
            default:
                System.out.println("Boisson inconnue !");
                sc.close();
                return;
        }
        
        System.out.print("Votre âge : ");
        int age = sc.nextInt();
        
        // IF avec || : réduction si jeune OU senior
        double reduction = 0;
        if (age < 18 || age >= 65) {
            reduction = prix * 0.20;
        }
        
        // IF avec && : supplément si chocolat ET pas enfant
        double supplement = 0;
        if (choix == 3 && age > 12) {
            supplement = 0.50;
        }
        
        double prixFinal = prix - reduction + supplement;
        
        System.out.println("\n╔═══════════════════════════╗");
        System.out.println("║       VOTRE TICKET        ║");
        System.out.println("╠═══════════════════════════╣");
        System.out.println("║ Boisson   : " + nom);
        System.out.println("║ Prix base : " + prix + " CHF");
        
        if (reduction > 0) {
            System.out.println("║ Réduction : -" + reduction + " CHF (tarif réduit)");
        }
        if (supplement > 0) {
            System.out.println("║ Supplément: +" + supplement + " CHF (chantilly)");
        }
        
        System.out.println("║ ─────────────────────────");
        System.out.println("║ TOTAL     : " + prixFinal + " CHF");
        System.out.println("╚═══════════════════════════╝");
        
        sc.close();
    }
}
