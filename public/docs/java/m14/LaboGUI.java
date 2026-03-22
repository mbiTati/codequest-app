import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

/**
 * CODEQUEST M14 — Swing & Events
 * Exercice : Panneau de controle du Labo
 * 
 * CONSIGNES :
 * 1. Completer les ActionListeners des boutons
 * 2. Ajouter la fonctionnalite Supprimer
 * 3. Mettre a jour le compteur
 * 4. BONUS : ajouter un bouton Rechercher
 */
public class LaboGUI extends JFrame {

    private ArrayList<String> inventions;
    private DefaultListModel<String> listModel;
    private JList<String> jListe;
    private JTextField champNom;
    private JLabel lblCompteur;

    public LaboGUI() {
        inventions = new ArrayList<>();
        
        // Configuration de la fenetre
        setTitle("Labo des Inventions — CodeQuest");
        setSize(500, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        // ======== PANEL NORD : Saisie ========
        JPanel panelNord = new JPanel(new FlowLayout());
        panelNord.add(new JLabel("Invention :"));
        champNom = new JTextField(20);
        panelNord.add(champNom);
        JButton btnAjouter = new JButton("Ajouter");
        panelNord.add(btnAjouter);

        // ======== CENTRE : Liste ========
        listModel = new DefaultListModel<>();
        jListe = new JList<>(listModel);
        JScrollPane scrollPane = new JScrollPane(jListe);

        // ======== PANEL SUD : Actions + Compteur ========
        JPanel panelSud = new JPanel(new FlowLayout());
        JButton btnSupprimer = new JButton("Supprimer");
        lblCompteur = new JLabel("Total : 0");
        panelSud.add(btnSupprimer);
        panelSud.add(Box.createHorizontalStrut(20));
        panelSud.add(lblCompteur);

        // ======== LISTENERS — A COMPLETER ========

        // TODO : ActionListener pour btnAjouter
        // 1. Lire le texte du champNom (getText().trim())
        // 2. Verifier que ce n'est pas vide
        // 3. Ajouter a la ArrayList ET au listModel
        // 4. Vider le champ
        // 5. Mettre a jour le compteur
        btnAjouter.addActionListener(e -> {
            // VOTRE CODE ICI
        });

        // TODO : ActionListener pour btnSupprimer
        // 1. Recuperer l'index selectionne (jListe.getSelectedIndex())
        // 2. Verifier que idx >= 0 (quelque chose est selectionne)
        // 3. Supprimer de la ArrayList ET du listModel
        // 4. Mettre a jour le compteur
        btnSupprimer.addActionListener(e -> {
            // VOTRE CODE ICI
        });

        // ======== ASSEMBLAGE ========
        add(panelNord, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);
        add(panelSud, BorderLayout.SOUTH);

        setVisible(true);
    }

    /**
     * Met a jour le label compteur.
     */
    private void majCompteur() {
        lblCompteur.setText("Total : " + inventions.size());
    }

    public static void main(String[] args) {
        new LaboGUI();
    }
}
